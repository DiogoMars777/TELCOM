<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

/**
 * CU09 - Evita mensualidades duplicadas para un mismo servicio y período.
 *
 * Migración INCREMENTAL: no modifica migraciones ya ejecutadas.
 * Es defensiva: si existieran duplicados previos, NO borra ni altera datos;
 * aborta con un mensaje para revisarlos manualmente.
 */
return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        $duplicados = DB::table('mensualidades')
            ->select('servicio_id', 'periodo')
            ->groupBy('servicio_id', 'periodo')
            ->havingRaw('COUNT(*) > 1')
            ->count();

        if ($duplicados > 0) {
            throw new RuntimeException(
                'Existen mensualidades duplicadas por (servicio_id, periodo). '.
                'Revíselas antes de aplicar el índice único; no se borró ningún dato.'
            );
        }

        Schema::table('mensualidades', function (Blueprint $table) {
            $table->unique(['servicio_id', 'periodo'], 'mensualidades_servicio_periodo_unique');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('mensualidades', function (Blueprint $table) {
            $table->dropUnique('mensualidades_servicio_periodo_unique');
        });
    }
};
