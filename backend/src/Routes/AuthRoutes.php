<?php
declare(strict_types=1);

namespace App\Routes;

use Psr\Http\Message\ResponseInterface as Response;
use Psr\Http\Message\ServerRequestInterface as Request;
use Firebase\JWT\JWT;
use MongoDB\Client;
use Respect\Validation\Validator as v;

class AuthRoutes
{
    private $mongoClient;

    public function __construct()
    {
        $connectionString = $_ENV['DB_CONNECTION_STRING'] ?? ($_ENV['DB_HOST'] . ':' . $_ENV['DB_PORT']);
        $this->mongoClient = new Client($connectionString);
    }

    public function register(Request $request, Response $response): Response
    {
        $data = json_decode($request->getBody()->getContents(), true);

        // Validate input
        $validation = v::key('email', v::email())
            ->key('password', v::stringType()->length(6, null))
            ->key('name', v::stringType()->length(2, 100))
            ->key('role', v::in(['customer', 'admin', 'staff']), false);

        try {
            $validation->assert($data);
        } catch (\Exception $e) {
            $response->getBody()->write(json_encode(['error' => 'Validation failed', 'details' => $e->getMessage()]));
            return $response->withHeader('Content-Type', 'application/json')->withStatus(400);
        }

        $db = $this->mongoClient->selectDatabase($_ENV['DB_DATABASE']);
        $users = $db->users;

        // Check if user already exists
        $existingUser = $users->findOne(['email' => $data['email']]);
        if ($existingUser) {
            $response->getBody()->write(json_encode(['error' => 'User already exists']));
            return $response->withHeader('Content-Type', 'application/json')->withStatus(409);
        }

        // Hash password
        $hashedPassword = password_hash($data['password'], PASSWORD_DEFAULT);

        // Create user
        $user = [
            'name' => $data['name'],
            'email' => $data['email'],
            'password' => $hashedPassword,
            'role' => $data['role'] ?? 'customer',
            'created_at' => new \MongoDB\BSON\UTCDateTime(),
            'updated_at' => new \MongoDB\BSON\UTCDateTime()
        ];

        $result = $users->insertOne($user);

        // Generate JWT token
        $token = JWT::encode([
            'user_id' => (string)$result->getInsertedId(),
            'email' => $data['email'],
            'role' => $user['role'],
            'iat' => time(),
            'exp' => time() + ($_ENV['JWT_EXPIRE_HOURS'] * 3600)
        ], $_ENV['JWT_SECRET'], 'HS256');

        $response->getBody()->write(json_encode([
            'message' => 'User registered successfully',
            'token' => $token,
            'user' => [
                'id' => (string)$result->getInsertedId(),
                'name' => $user['name'],
                'email' => $user['email'],
                'role' => $user['role']
            ]
        ]));

        return $response->withHeader('Content-Type', 'application/json')->withStatus(201);
    }

    public function login(Request $request, Response $response): Response
    {
        $data = json_decode($request->getBody()->getContents(), true);

        // Validate input
        $validation = v::key('email', v::email())
            ->key('password', v::stringType());

        try {
            $validation->assert($data);
        } catch (\Exception $e) {
            $response->getBody()->write(json_encode(['error' => 'Invalid email or password format']));
            return $response->withHeader('Content-Type', 'application/json')->withStatus(400);
        }

        $db = $this->mongoClient->selectDatabase($_ENV['DB_DATABASE']);
        $users = $db->users;

        // Find user
        $user = $users->findOne(['email' => $data['email']]);
        if (!$user || !password_verify($data['password'], $user['password'])) {
            $response->getBody()->write(json_encode(['error' => 'Invalid credentials']));
            return $response->withHeader('Content-Type', 'application/json')->withStatus(401);
        }

        // Generate JWT token
        $token = JWT::encode([
            'user_id' => (string)$user['_id'],
            'email' => $user['email'],
            'role' => $user['role'],
            'iat' => time(),
            'exp' => time() + ($_ENV['JWT_EXPIRE_HOURS'] * 3600)
        ], $_ENV['JWT_SECRET'], 'HS256');

        $response->getBody()->write(json_encode([
            'message' => 'Login successful',
            'token' => $token,
            'user' => [
                'id' => (string)$user['_id'],
                'name' => $user['name'],
                'email' => $user['email'],
                'role' => $user['role']
            ]
        ]));

        return $response->withHeader('Content-Type', 'application/json');
    }

    public function refresh(Request $request, Response $response): Response
    {
        $user = $request->getAttribute('user');

        $db = $this->mongoClient->selectDatabase($_ENV['DB_DATABASE']);
        $users = $db->users;
        $userData = $users->findOne(['_id' => new \MongoDB\BSON\ObjectId($user->user_id)]);

        if (!$userData) {
            $response->getBody()->write(json_encode(['error' => 'User not found']));
            return $response->withHeader('Content-Type', 'application/json')->withStatus(404);
        }

        // Generate new JWT token
        $token = JWT::encode([
            'user_id' => (string)$userData['_id'],
            'email' => $userData['email'],
            'role' => $userData['role'],
            'iat' => time(),
            'exp' => time() + ($_ENV['JWT_EXPIRE_HOURS'] * 3600)
        ], $_ENV['JWT_SECRET'], 'HS256');

        $response->getBody()->write(json_encode([
            'message' => 'Token refreshed successfully',
            'token' => $token
        ]));

        return $response->withHeader('Content-Type', 'application/json');
    }

    public function logout(Request $request, Response $response): Response
    {
        // In a stateless JWT system, logout is handled client-side by removing the token
        $response->getBody()->write(json_encode(['message' => 'Logged out successfully']));
        return $response->withHeader('Content-Type', 'application/json');
    }
}
