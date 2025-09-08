<?php
declare(strict_types=1);

use DI\Container;
use Slim\Factory\AppFactory;
use Slim\Routing\RouteCollectorProxy;
use Psr\Http\Message\ResponseInterface as Response;
use Psr\Http\Message\ServerRequestInterface as Request;

// Load environment variables
require_once __DIR__ . '/../vendor/autoload.php';
$dotenv = Dotenv\Dotenv::createImmutable(__DIR__ . '/..');
$dotenv->load();

// Create Container
$container = new Container();

// Create App
AppFactory::setContainer($container);
$app = AppFactory::create();

// Performance middleware - add compression and caching headers
$app->add(function (Request $request, $handler) {
    $response = $handler->handle($request);

    // Add compression headers
    $response = $response->withHeader('Content-Encoding', 'gzip')
                        ->withHeader('Vary', 'Accept-Encoding');

    // Add security headers
    $response = $response->withHeader('X-Content-Type-Options', 'nosniff')
                        ->withHeader('X-Frame-Options', 'DENY')
                        ->withHeader('X-XSS-Protection', '1; mode=block');

    // Add caching headers for API responses (short cache for dynamic content)
    if (str_contains($request->getUri()->getPath(), '/api/')) {
        $response = $response->withHeader('Cache-Control', 'private, max-age=300'); // 5 minutes
    }

    return $response;
});

// Add middleware
$app->add(new App\Middleware\CorsMiddleware());
$app->add(new App\Middleware\AuthMiddleware($container));
$app->add(new App\Middleware\RoleMiddleware($container));

// Routes
$app->group('/api/v1', function (RouteCollectorProxy $group) use ($container) {
    $group->group('/auth', function (RouteCollectorProxy $auth) {
        $auth->post('/register', App\Routes\AuthRoutes::class . ':register');
        $auth->post('/login', App\Routes\AuthRoutes::class . ':login');
        $auth->post('/refresh', App\Routes\AuthRoutes::class . ':refresh');
        $auth->post('/logout', App\Routes\AuthRoutes::class . ':logout');
    });

    $group->group('/products', function (RouteCollectorProxy $products) use ($container) {
        $products->get('', App\Routes\ProductRoutes::class . ':getAll');
        $products->get('/{id}', App\Routes\ProductRoutes::class . ':getById');
        $products->post('', App\Routes\ProductRoutes::class . ':create')->add(new App\Middleware\RoleMiddleware($container, ['admin', 'staff']));
        $products->put('/{id}', App\Routes\ProductRoutes::class . ':update')->add(new App\Middleware\RoleMiddleware($container, ['admin', 'staff']));
        $products->delete('/{id}', App\Routes\ProductRoutes::class . ':delete')->add(new App\Middleware\RoleMiddleware($container, ['admin']));
    });

    $group->group('/users', function (RouteCollectorProxy $users) use ($container) {
        $users->get('', App\Routes\UserRoutes::class . ':getAll')->add(new App\Middleware\RoleMiddleware($container, ['admin']));
        $users->get('/profile', App\Routes\UserRoutes::class . ':getProfile');
        $users->get('/{id}', App\Routes\UserRoutes::class . ':getById')->add(new App\Middleware\RoleMiddleware($container, ['admin']));
        $users->put('/{id}', App\Routes\UserRoutes::class . ':update')->add(new App\Middleware\RoleMiddleware($container, ['admin']));
        $users->delete('/{id}', App\Routes\UserRoutes::class . ':delete')->add(new App\Middleware\RoleMiddleware($container, ['admin']));
    });

    $group->group('/orders', function (RouteCollectorProxy $orders) use ($container) {
        $orders->get('', App\Routes\OrderRoutes::class . ':getAll');
        $orders->get('/{id}', App\Routes\OrderRoutes::class . ':getById');
        $orders->post('', App\Routes\OrderRoutes::class . ':create');
        $orders->put('/{id}/status', App\Routes\OrderRoutes::class . ':updateStatus')->add(new App\Middleware\RoleMiddleware($container, ['admin', 'staff']));
    });

    $group->group('/cart', function (RouteCollectorProxy $cart) {
        $cart->get('', App\Routes\CartRoutes::class . ':getCart');
        $cart->post('/items', App\Routes\CartRoutes::class . ':addItem');
        $cart->put('/items/{id}', App\Routes\CartRoutes::class . ':updateItem');
        $cart->delete('/items/{id}', App\Routes\CartRoutes::class . ':removeItem');
        $cart->delete('', App\Routes\CartRoutes::class . ':clearCart');
    });
});

// Error handling
$app->addErrorMiddleware(true, true, true);

// Run app
$app->run();
