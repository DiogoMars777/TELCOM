<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

/**
 * ETAPA 1 (Usuarios y Roles) - Migración incremental.
 *
 * Amplía la tabla `users` de Laravel (no se crea una segunda tabla de usuarios)
 * según el modelo UML BaseTelcom01.mdj:
 *
 *   Clase Usuario: nombreUsuario, telefono, activo  (+ asociación Rol[1] -> Usuario[0..*])
 *
 * Correspondencias con campos estándar de Laravel (no se renombran):
 *   name     -> nombreCompleto
 *   email    -> correo
 *   password -> passwordHash
 *
 * Todas las columnas se agregan de forma compatible con los registros existentes:
 * `rol_id`, `nombre_usuario` y `telefono` son nullable; `activo` tiene default true.
 */
return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('users', function (Blueprint $table) {
            // Asociación UML: Rol [1] ---- Usuario [0..*]
            // Nullable para no romper los usuarios existentes; restrictOnDelete evita
            // borrar un rol que todavía está asignado (no se pierde la asignación).
            $table->foreignId('rol_id')
                ->nullable()
                ->constrained('roles')
                ->restrictOnDelete();

            // Atributo UML: nombreUsuario (no se pierde este dato)
            $table->string('nombre_usuario', 100)->nullable();

            // Atributo UML: telefono
            $table->string('telefono', 50)->nullable();

            // Atributo UML: activo
            $table->boolean('activo')->default(true);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropForeign(['rol_id']);
            $table->dropColumn(['rol_id', 'nombre_usuario', 'telefono', 'activo']);
        });
    }
};
