<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

/**
 * Entidades del UML: EstadoServicio, PlanInternet y AsignacionPlan.
 *
 * Migración SOLO de esquema e incremental:
 *  - No modifica migraciones ya ejecutadas.
 *  - No elimina las columnas antiguas de `servicios_internet`
 *    (plan_nombre, velocidad_mbps, precio_mensual, estado_servicio).
 *  - Añade la relación ServicioInternet -> EstadoServicio.
 */
return new class extends Migration
{
    public function up(): void
    {
        // UML EstadoServicio: idEstadoServicio, nombreEstado, descripcion.
        Schema::create('estados_servicio', function (Blueprint $table) {
            $table->id();
            $table->string('nombre_estado', 50)->unique();
            $table->text('descripcion')->nullable();
            $table->timestamps();
        });

        // UML PlanInternet: idPlan, nombrePlan, velocidadMbps, precioMensual,
        // descripcion, activo.
        Schema::create('planes_internet', function (Blueprint $table) {
            $table->id();
            $table->string('nombre_plan', 100);
            $table->integer('velocidad_mbps');
            $table->decimal('precio_mensual', 10, 2);
            $table->text('descripcion')->nullable();
            $table->boolean('activo')->default(true);
            $table->timestamps();

            // Evita duplicar un mismo plan (nombre + velocidad).
            $table->unique(['nombre_plan', 'velocidad_mbps'], 'planes_internet_nombre_velocidad_unique');
        });

        // UML AsignacionPlan: idAsignacionPlan, fechaInicio, fechaFin,
        // precioAplicado, motivoCambio.
        // Relaciones: ServicioInternet 1..*, PlanInternet 1, Usuario 1 registra.
        Schema::create('asignaciones_plan', function (Blueprint $table) {
            $table->id();
            $table->foreignId('servicio_id')->constrained('servicios_internet')->cascadeOnDelete();
            $table->foreignId('plan_id')->constrained('planes_internet')->restrictOnDelete();

            // `user_id` es NULLABLE únicamente para poder migrar servicios
            // históricos cuyo autor de la asignación no está registrado.
            // TODA asignación nueva lo exige (se toma del usuario autenticado),
            // cumpliendo la relación final del UML ("registra").
            $table->foreignId('user_id')->nullable()->constrained('users')->nullOnDelete();

            $table->date('fecha_inicio');
            $table->date('fecha_fin')->nullable();
            $table->decimal('precio_aplicado', 10, 2);
            $table->string('motivo_cambio', 255)->nullable();
            $table->timestamps();

            $table->index(['servicio_id', 'fecha_fin'], 'asignaciones_plan_servicio_fecha_index');
        });

        // Como máximo UNA asignación vigente (fecha_fin NULL) por servicio.
        // Índice parcial: soportado por PostgreSQL y SQLite.
        DB::statement(
            'CREATE UNIQUE INDEX asignaciones_plan_servicio_abierta_unique '
            .'ON asignaciones_plan (servicio_id) WHERE fecha_fin IS NULL'
        );

        // Relación UML "define": ServicioInternet pertenece a un EstadoServicio.
        Schema::table('servicios_internet', function (Blueprint $table) {
            $table->foreignId('estado_servicio_id')->nullable()
                ->constrained('estados_servicio')->nullOnDelete();
        });
    }

    public function down(): void
    {
        Schema::table('servicios_internet', function (Blueprint $table) {
            $table->dropConstrainedForeignId('estado_servicio_id');
        });

        Schema::dropIfExists('asignaciones_plan');
        Schema::dropIfExists('planes_internet');
        Schema::dropIfExists('estados_servicio');
    }
};
