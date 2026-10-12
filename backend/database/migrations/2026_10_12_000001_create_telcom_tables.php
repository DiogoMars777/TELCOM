<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations for PostgreSQL.
     */
    public function up(): void
    {
        // CU01: Sesiones de usuario
        Schema::create('user_sessions', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->ipAddress('ip_address')->nullable();
            $table->text('user_agent')->nullable();
            $table->timestamp('login_at')->useCurrent();
            $table->timestamp('logout_at')->nullable();
            $table->boolean('is_active')->default(true);
            $table->timestamps();
        });

        // CU02: Bitácora de auditoría
        Schema::create('bitacora_auditorias', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->nullable()->constrained()->nullOnDelete();
            $table->string('modulo', 100);
            $table->string('accion', 100);
            $table->text('detalles');
            $table->ipAddress('ip_origen')->nullable();
            $table->jsonb('datos_previos')->nullable();
            $table->jsonb('datos_nuevos')->nullable();
            $table->timestamps();
        });

        // CU03: Roles y Permisos
        Schema::create('roles', function (Blueprint $table) {
            $table->id();
            $table->string('nombre', 100);
            $table->string('slug', 100)->unique();
            $table->string('descripcion')->nullable();
            $table->boolean('activo')->default(true);
            $table->timestamps();
        });

        Schema::create('permisos', function (Blueprint $table) {
            $table->id();
            $table->string('nombre', 100);
            $table->string('slug', 100)->unique();
            $table->string('modulo', 100);
            $table->timestamps();
        });

        Schema::create('rol_permiso', function (Blueprint $table) {
            $table->id();
            $table->foreignId('rol_id')->constrained('roles')->cascadeOnDelete();
            $table->foreignId('permiso_id')->constrained('permisos')->cascadeOnDelete();
            $table->timestamps();
        });

        // CU04: Zonas de cobertura
        Schema::create('zonas_cobertura', function (Blueprint $table) {
            $table->id();
            $table->string('codigo', 50)->unique();
            $table->string('nombre', 150);
            $table->string('ciudad', 100);
            $table->string('tecnologia', 100); // Fibra, Radioenlace
            $table->integer('capacidad_nodos')->default(100);
            $table->boolean('activo')->default(true);
            $table->timestamps();
        });

        // CU05, CU06, CU07: Clientes
        Schema::create('clientes', function (Blueprint $table) {
            $table->id();
            $table->string('codigo_cliente', 50)->unique();
            $table->string('documento_identidad', 50)->unique();
            $table->string('tipo_documento', 20)->default('CI');
            $table->string('nombres', 150);
            $table->string('apellidos', 150);
            $table->string('telefono', 50);
            $table->string('email', 150)->unique();
            $table->string('direccion', 255);
            $table->foreignId('zona_id')->constrained('zonas_cobertura')->cascadeOnDelete();
            $table->string('estado', 50)->default('ACTIVO'); // ACTIVO, INACTIVO, SUSPENDIDO
            $table->string('motivo_baja')->nullable();
            $table->timestamp('fecha_baja')->nullable();
            $table->softDeletes();
            $table->timestamps();
        });

        // CU08: Servicios de Internet
        Schema::create('servicios_internet', function (Blueprint $table) {
            $table->id();
            $table->string('codigo_servicio', 50)->unique();
            $table->foreignId('cliente_id')->constrained('clientes')->cascadeOnDelete();
            $table->string('plan_nombre', 100);
            $table->integer('velocidad_mbps');
            $table->decimal('precio_mensual', 10, 2);
            $table->ipAddress('ip_asignada')->nullable();
            $table->string('mac_router', 50)->nullable();
            $table->string('direccion_instalacion', 255);
            $table->date('fecha_instalacion');
            $table->date('fecha_activacion')->nullable();
            $table->string('estado_servicio', 50)->default('PENDIENTE_INSTALACION');
            $table->integer('dia_corte')->default(10);
            $table->timestamps();
        });

        // CU09: Mensualidades de Servicios
        Schema::create('mensualidades', function (Blueprint $table) {
            $table->id();
            $table->string('codigo_factura', 50)->unique();
            $table->foreignId('cliente_id')->constrained('clientes')->cascadeOnDelete();
            $table->foreignId('servicio_id')->constrained('servicios_internet')->cascadeOnDelete();
            $table->string('periodo', 10); // YYYY-MM
            $table->decimal('monto', 10, 2);
            $table->date('fecha_emision');
            $table->date('fecha_vencimiento');
            $table->string('estado_pago', 50)->default('PENDIENTE'); // PENDIENTE, PAGADO, VENCIDO
            $table->timestamps();
        });

        // CU10, CU11: Pagos
        Schema::create('pagos', function (Blueprint $table) {
            $table->id();
            $table->string('codigo_recibo', 50)->unique();
            $table->foreignId('mensualidad_id')->constrained('mensualidades')->cascadeOnDelete();
            $table->decimal('monto_pagado', 10, 2);
            $table->string('metodo_pago', 50); // EFECTIVO, QR, TRANSFERENCIA, TARJETA
            $table->string('numero_transaccion', 100)->nullable();
            $table->timestamp('fecha_pago')->useCurrent();
            $table->foreignId('cajero_user_id')->nullable()->constrained('users')->nullOnDelete();
            $table->string('observaciones')->nullable();
            $table->timestamps();
        });

        // CU12: Alertas de Vencimiento
        Schema::create('alertas_vencimiento', function (Blueprint $table) {
            $table->id();
            $table->foreignId('mensualidad_id')->constrained('mensualidades')->cascadeOnDelete();
            $table->string('tipo_alerta', 50);
            $table->integer('dias_retraso')->default(0);
            $table->boolean('notificado')->default(false);
            $table->timestamp('fecha_notificacion')->nullable();
            $table->timestamps();
        });

        // CU13, CU14: Cortes Realizados
        Schema::create('cortes_servicio', function (Blueprint $table) {
            $table->id();
            $table->string('codigo_orden_corte', 50)->unique();
            $table->foreignId('servicio_id')->constrained('servicios_internet')->cascadeOnDelete();
            $table->foreignId('tecnico_user_id')->nullable()->constrained('users')->nullOnDelete();
            $table->string('tipo_corte', 50); // LOGICO, FISICO
            $table->string('motivo', 255);
            $table->timestamp('fecha_corte')->useCurrent();
            $table->text('observaciones')->nullable();
            $table->timestamps();
        });

        // CU15: Reactivaciones de Servicio
        Schema::create('reactivaciones_servicio', function (Blueprint $table) {
            $table->id();
            $table->string('codigo_reactivacion', 50)->unique();
            $table->foreignId('servicio_id')->constrained('servicios_internet')->cascadeOnDelete();
            $table->foreignId('pago_id')->nullable()->constrained('pagos')->nullOnDelete();
            $table->foreignId('user_id')->nullable()->constrained('users')->nullOnDelete();
            $table->timestamp('fecha_reactivacion')->useCurrent();
            $table->decimal('costo_reactivacion', 10, 2)->default(0.00);
            $table->text('observaciones')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('reactivaciones_servicio');
        Schema::dropIfExists('cortes_servicio');
        Schema::dropIfExists('alertas_vencimiento');
        Schema::dropIfExists('pagos');
        Schema::dropIfExists('mensualidades');
        Schema::dropIfExists('servicios_internet');
        Schema::dropIfExists('clientes');
        Schema::dropIfExists('zonas_cobertura');
        Schema::dropIfExists('rol_permiso');
        Schema::dropIfExists('permisos');
        Schema::dropIfExists('roles');
        Schema::dropIfExists('bitacora_auditorias');
        Schema::dropIfExists('user_sessions');
    }
};
