<?php

use App\Http\Controllers\ProfileController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\AttendancesController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;


Route::get('/', function () {
    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
    ]);
});

Route::get('/dashboard', function () {
    return Inertia::render('Dashboard');
})->middleware(['auth', 'verified'])->name('dashboard');

Route::middleware(['auth', 'admin']) -> group(function(){
    route::get('/users', [UserController::class,'index'])->name('users');
    route::get('/users/create', [UserController::class,'Create'])->name('users.create');
    route::post('/users/store', [UserController::class,'store'])->name('users.store');
    route::get('/users/edit/{user}', [UserController::class,'edit'])->name('users.edit');
    route::patch('/users/update/{user}', [UserController::class,'update'])->name('users.update');
});


Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');

    Route::post('attendances/submit', [AttendancesController::class, 'submit'])->name('attendances.submit');
});


require __DIR__.'/auth.php';
