<?php
declare(strict_types=1);

namespace App\Routes;

use Psr\Http\Message\ResponseInterface as Response;
use Psr\Http\Message\ServerRequestInterface as Request;
use MongoDB\Client;
use Respect\Validation\Validator as v;
use MongoDB\BSON\ObjectId;

class ProductRoutes
{
    private $mongoClient;

    public function __construct()
    {
        $this->mongoClient = new Client($_ENV['DB_HOST'] . ':' . $_ENV['DB_PORT']);
    }

    public function getAll(Request $request, Response $response): Response
    {
        try {
            $db = $this->mongoClient->selectDatabase($_ENV['DB_DATABASE']);
            $products = $db->products;

            $query = [];
            $options = [
                'sort' => ['created_at' => -1]
            ];

            // Add pagination
            $params = $request->getQueryParams();
            if (isset($params['limit'])) {
                $options['limit'] = (int)$params['limit'];
            }
            if (isset($params['skip'])) {
                $options['skip'] = (int)$params['skip'];
            }

            // Add category filter
            if (isset($params['category'])) {
                $query['category'] = $params['category'];
            }

            // Add search
            if (isset($params['search'])) {
                $query['$or'] = [
                    ['name' => new \MongoDB\BSON\Regex($params['search'], 'i')],
                    ['description' => new \MongoDB\BSON\Regex($params['search'], 'i')]
                ];
            }

            $result = $products->find($query, $options);
            $productList = [];

            foreach ($result as $product) {
                $productList[] = [
                    'id' => (string)$product['_id'],
                    'name' => $product['name'],
                    'description' => $product['description'],
                    'price' => $product['price'],
                    'category' => $product['category'],
                    'stock' => $product['stock'],
                    'images' => $product['images'] ?? [],
                    'created_at' => $product['created_at']->toDateTime()->format('c'),
                    'updated_at' => $product['updated_at']->toDateTime()->format('c')
                ];
            }

            $response->getBody()->write(json_encode($productList));
            return $response->withHeader('Content-Type', 'application/json');

        } catch (\Exception $e) {
            $response->getBody()->write(json_encode(['error' => 'Failed to fetch products']));
            return $response->withHeader('Content-Type', 'application/json')->withStatus(500);
        }
    }

    public function getById(Request $request, Response $response, array $args): Response
    {
        try {
            $db = $this->mongoClient->selectDatabase($_ENV['DB_DATABASE']);
            $products = $db->products;

            $product = $products->findOne(['_id' => new ObjectId($args['id'])]);

            if (!$product) {
                $response->getBody()->write(json_encode(['error' => 'Product not found']));
                return $response->withHeader('Content-Type', 'application/json')->withStatus(404);
            }

            $productData = [
                'id' => (string)$product['_id'],
                'name' => $product['name'],
                'description' => $product['description'],
                'price' => $product['price'],
                'category' => $product['category'],
                'stock' => $product['stock'],
                'images' => $product['images'] ?? [],
                'created_at' => $product['created_at']->toDateTime()->format('c'),
                'updated_at' => $product['updated_at']->toDateTime()->format('c')
            ];

            $response->getBody()->write(json_encode($productData));
            return $response->withHeader('Content-Type', 'application/json');

        } catch (\Exception $e) {
            $response->getBody()->write(json_encode(['error' => 'Failed to fetch product']));
            return $response->withHeader('Content-Type', 'application/json')->withStatus(500);
        }
    }

    public function create(Request $request, Response $response): Response
    {
        $data = json_decode($request->getBody()->getContents(), true);

        // Validate input
        $validation = v::key('name', v::stringType()->length(1, 255))
            ->key('description', v::stringType()->length(1, 1000))
            ->key('price', v::numeric()->min(0))
            ->key('category', v::stringType()->length(1, 100))
            ->key('stock', v::intType()->min(0));

        try {
            $validation->assert($data);
        } catch (\Exception $e) {
            $response->getBody()->write(json_encode(['error' => 'Validation failed', 'details' => $e->getMessage()]));
            return $response->withHeader('Content-Type', 'application/json')->withStatus(400);
        }

        try {
            $db = $this->mongoClient->selectDatabase($_ENV['DB_DATABASE']);
            $products = $db->products;

            $product = [
                'name' => $data['name'],
                'description' => $data['description'],
                'price' => (float)$data['price'],
                'category' => $data['category'],
                'stock' => (int)$data['stock'],
                'images' => $data['images'] ?? [],
                'created_at' => new \MongoDB\BSON\UTCDateTime(),
                'updated_at' => new \MongoDB\BSON\UTCDateTime()
            ];

            $result = $products->insertOne($product);

            $productData = [
                'id' => (string)$result->getInsertedId(),
                'name' => $product['name'],
                'description' => $product['description'],
                'price' => $product['price'],
                'category' => $product['category'],
                'stock' => $product['stock'],
                'images' => $product['images'],
                'created_at' => $product['created_at']->toDateTime()->format('c'),
                'updated_at' => $product['updated_at']->toDateTime()->format('c')
            ];

            $response->getBody()->write(json_encode([
                'message' => 'Product created successfully',
                'product' => $productData
            ]));

            return $response->withHeader('Content-Type', 'application/json')->withStatus(201);

        } catch (\Exception $e) {
            $response->getBody()->write(json_encode(['error' => 'Failed to create product']));
            return $response->withHeader('Content-Type', 'application/json')->withStatus(500);
        }
    }

    public function update(Request $request, Response $response, array $args): Response
    {
        $data = json_decode($request->getBody()->getContents(), true);

        // Validate input (all fields optional for update)
        $validation = v::key('name', v::stringType()->length(1, 255), false)
            ->key('description', v::stringType()->length(1, 1000), false)
            ->key('price', v::numeric()->min(0), false)
            ->key('category', v::stringType()->length(1, 100), false)
            ->key('stock', v::intType()->min(0), false);

        try {
            $validation->assert($data);
        } catch (\Exception $e) {
            $response->getBody()->write(json_encode(['error' => 'Validation failed', 'details' => $e->getMessage()]));
            return $response->withHeader('Content-Type', 'application/json')->withStatus(400);
        }

        try {
            $db = $this->mongoClient->selectDatabase($_ENV['DB_DATABASE']);
            $products = $db->products;

            $updateData = [];
            if (isset($data['name'])) $updateData['name'] = $data['name'];
            if (isset($data['description'])) $updateData['description'] = $data['description'];
            if (isset($data['price'])) $updateData['price'] = (float)$data['price'];
            if (isset($data['category'])) $updateData['category'] = $data['category'];
            if (isset($data['stock'])) $updateData['stock'] = (int)$data['stock'];
            if (isset($data['images'])) $updateData['images'] = $data['images'];

            $updateData['updated_at'] = new \MongoDB\BSON\UTCDateTime();

            $result = $products->updateOne(
                ['_id' => new ObjectId($args['id'])],
                ['$set' => $updateData]
            );

            if ($result->getModifiedCount() === 0) {
                $response->getBody()->write(json_encode(['error' => 'Product not found or no changes made']));
                return $response->withHeader('Content-Type', 'application/json')->withStatus(404);
            }

            $response->getBody()->write(json_encode(['message' => 'Product updated successfully']));
            return $response->withHeader('Content-Type', 'application/json');

        } catch (\Exception $e) {
            $response->getBody()->write(json_encode(['error' => 'Failed to update product']));
            return $response->withHeader('Content-Type', 'application/json')->withStatus(500);
        }
    }

    public function delete(Request $request, Response $response, array $args): Response
    {
        try {
            $db = $this->mongoClient->selectDatabase($_ENV['DB_DATABASE']);
            $products = $db->products;

            $result = $products->deleteOne(['_id' => new ObjectId($args['id'])]);

            if ($result->getDeletedCount() === 0) {
                $response->getBody()->write(json_encode(['error' => 'Product not found']));
                return $response->withHeader('Content-Type', 'application/json')->withStatus(404);
            }

            $response->getBody()->write(json_encode(['message' => 'Product deleted successfully']));
            return $response->withHeader('Content-Type', 'application/json');

        } catch (\Exception $e) {
            $response->getBody()->write(json_encode(['error' => 'Failed to delete product']));
            return $response->withHeader('Content-Type', 'application/json')->withStatus(500);
        }
    }
}
