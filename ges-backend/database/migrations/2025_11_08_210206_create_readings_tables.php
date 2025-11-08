<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        // Tabla de lecturas mensuales
        Schema::create('monthly_readings', function (Blueprint $table) {
            $table->id();
            $table->date('reading_date');
            $table->decimal('lectura1', 10, 2);
            $table->decimal('lectura2', 10, 2);
            $table->decimal('total_reading', 10, 2);
            $table->string('periodo', 50); // Ej: "Enero-Febrero"
            $table->timestamps();
        });

        // Tabla de lecturas por departamento
        Schema::create('department_readings', function (Blueprint $table) {
            $table->id();
            $table->foreignId('monthly_reading_id')->constrained()->onDelete('cascade');
            $table->string('department', 20); // PB-A, PB-B, etc.
            $table->decimal('current_reading', 10, 2);
            $table->decimal('previous_reading', 10, 2)->nullable();
            $table->decimal('consumption', 10, 2);
            $table->decimal('unit_price', 10, 2);
            $table->decimal('total_bs', 10, 2);
            $table->integer('total_bs_rounded');
            $table->timestamps();
        });

        // Índices para mejorar rendimiento
        Schema::table('monthly_readings', function (Blueprint $table) {
            $table->index('reading_date');
            $table->index('periodo');
        });

        Schema::table('department_readings', function (Blueprint $table) {
            $table->index('department');
            $table->index('monthly_reading_id');
        });
    }

    public function down()
    {
        Schema::dropIfExists('department_readings');
        Schema::dropIfExists('monthly_readings');
    }
};