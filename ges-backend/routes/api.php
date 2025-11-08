<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\ReadingController;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
*/

// Ruta de prueba
Route::get('/test', function () {
    return response()->json([
        'success' => true,
        'message' => 'API funcionando correctamente'
    ]);
});

// Rutas para lecturas
Route::prefix('readings')->group(function () {
    // CRUD básico
    Route::get('/', [ReadingController::class, 'index']); // GET /api/readings
    Route::post('/', [ReadingController::class, 'store']); // POST /api/readings
    Route::get('/{id}', [ReadingController::class, 'show']); // GET /api/readings/{id}
    Route::put('/{id}', [ReadingController::class, 'update']); // PUT /api/readings/{id}
    Route::delete('/{id}', [ReadingController::class, 'destroy']); // DELETE /api/readings/{id}
    
    // Rutas especiales
    Route::get('/periodo/{periodo}', [ReadingController::class, 'getByPeriodo']); // GET /api/readings/periodo/{periodo}
    Route::get('/previous/{department}', [ReadingController::class, 'getPreviousReading']); // GET /api/readings/previous/{department}
});