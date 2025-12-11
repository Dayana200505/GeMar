<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::create('water_readings', function (Blueprint $table) {
            $table->id();
            $table->foreignId('department_id')->constrained()->onDelete('cascade');
            $table->date('reading_date');
            $table->decimal('current_reading', 10, 2);
            $table->decimal('previous_reading', 10, 2)->default(0);
            $table->decimal('consumption', 10, 2)->default(0);
            $table->decimal('price_per_cube', 10, 4)->default(0);
            $table->decimal('total_amount', 10, 2)->default(0);
            $table->decimal('rounded_amount', 10, 2)->default(0);
            $table->integer('days_consumption')->default(30);
            $table->timestamps();
            
            $table->unique(['department_id', 'reading_date']);
        });
    }

    public function down()
    {
        Schema::dropIfExists('water_readings');
    }
};