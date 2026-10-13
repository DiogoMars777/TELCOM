<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

/**
 * CU04 - Ampliación ADITIVA de `zonas_cobertura`.
 *
 * La tabla ya existe y está en uso (creada en
 * 2026_10_12_000001_create_telcom_tables). Esta migración NO la recrea ni
 * modifica la migración anterior: solo agrega columnas nuevas y conserva
 * todos los registros existentes.
 *
 * Columnas nuevas:
 * - `barrio`           : Barrio o sector (texto).
 * - `estado_cobertura` : Estado de cobertura. Texto validado en la aplicación
 *                        (Disponible, Parcial, Saturada, En expansión).
 *                        Nullable y SIN valor por defecto a propósito: los
 *                        registros antiguos no tienen un estado conocido y no
 *                        se les debe asignar "Disponible" automáticamente.
 * - `area_mapa`        : Área dibujada en el mapa como GeoJSON (polígono),
 *                        guardada en una columna JSON. Compatible con
 *                        PostgreSQL (json) y con SQLite en las pruebas.
 *                        NO se usa PostGIS.
 */
return new class extends Migration
{
    public function up(): void
    {
        Schema::table('zonas_cobertura', function (Blueprint $table) {
            // Barrio o sector: opcional para no romper los registros existentes.
            $table->string('barrio', 150)->nullable();

            // Estado de cobertura: sin valor por defecto (ver nota de la clase).
            $table->string('estado_cobertura', 30)->nullable();

            // GeoJSON del polígono dibujado en el mapa (nullable).
            $table->json('area_mapa')->nullable();
        });
    }

    public function down(): void
    {
        Schema::table('zonas_cobertura', function (Blueprint $table) {
            // Solo elimina las columnas nuevas; nunca toca las originales.
            $table->dropColumn(['barrio', 'estado_cobertura', 'area_mapa']);
        });
    }
};
