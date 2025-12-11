<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::create('payments', function (Blueprint $table) {
            $table->id();
            $table->foreignId('department_id')->constrained()->onDelete('cascade');
            $table->foreignId('water_reading_id')->nullable()->constrained()->onDelete('set null');
            $table->date('month');
            $table->decimal('expenses_amount', 10, 2)->default(0);
            $table->decimal('water_amount', 10, 2)->default(0);
            $table->decimal('total_amount', 10, 2)->default(0);
            $table->decimal('paid_amount', 10, 2)->nullable();
            $table->enum('status', ['pending', 'paid'])->default('pending');
            $table->date('payment_date')->nullable();
            $table->timestamps();
            
            $table->unique(['department_id', 'month']);
        });
    }

    public function down()
    {
        Schema::dropIfExists('payments');
    }
};