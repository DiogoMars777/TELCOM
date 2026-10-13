<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

/**
 * Migración de DATOS (incremental y no destructiva).
 *
 * 1. Crea el catálogo base de estados de servicio usados por el código
 *    (PENDIENTE_INSTALACION, ACTIVO, SUSPENDIDO, CORTADO).
 *    Si un servicio tuviera un estado NO contemplado, se agrega al catálogo
 *    (no se pierde información).
 * 2. Crea un PlanInternet por cada combinación (plan_nombre, velocidad_mbps)
 *    que exista hoy en `servicios_internet`. NO elimina ni sobrescribe las
 *    columnas antiguas (plan_nombre, velocidad_mbps, precio_mensual).
 * 3. Crea la AsignacionPlan inicial de cada servicio, conservando el precio
 *    histórico exacto en `precio_aplicado` (nunca se pierde un precio).
 *
 * Sobre el autor de la asignación (UML: Usuario 1 -> 0..* AsignacionPlan):
 * los servicios históricos NO registran quién asignó el plan, por lo que
 * `user_id` queda NULL (no se inventa el dato). Toda asignación NUEVA sí lo
 * exige, ver `AsignacionPlanController`.
 */
return new class extends Migration
{
    public function up(): void
    {
        $now = now();

        // 1. Catálogo base de estados (idempotente).
        $estados = [
            'PENDIENTE_INSTALACION' => 'Servicio registrado, pendiente de instalación/verificación técnica.',
            'ACTIVO'                => 'Servicio habilitado y en funcionamiento.',
            'SUSPENDIDO'            => 'Servicio suspendido temporalmente.',
            'CORTADO'               => 'Servicio cortado por falta de pago u otra causa.',
        ];

        foreach ($estados as $nombre => $descripcion) {
            DB::table('estados_servicio')->updateOrInsert(
                ['nombre_estado' => $nombre],
                ['descripcion' => $descripcion, 'updated_at' => $now, 'created_at' => $now]
            );
        }

        $planIds = [];

        // `servicios_internet` puede estar vacía (por ejemplo en pruebas).
        foreach (DB::table('servicios_internet')->orderBy('id')->get() as $servicio) {
            // 1.1 Enlazar el servicio con su EstadoServicio (creándolo si hace falta).
            if ($servicio->estado_servicio !== null && $servicio->estado_servicio !== '') {
                $estadoId = DB::table('estados_servicio')
                    ->where('nombre_estado', $servicio->estado_servicio)
                    ->value('id');

                if ($estadoId === null) {
                    $estadoId = DB::table('estados_servicio')->insertGetId([
                        'nombre_estado' => $servicio->estado_servicio,
                        'descripcion'   => 'Estado migrado desde servicios_internet (no estaba en el catálogo base).',
                        'created_at'    => $now,
                        'updated_at'    => $now,
                    ]);
                }

                if ($servicio->estado_servicio_id === null) {
                    DB::table('servicios_internet')
                        ->where('id', $servicio->id)
                        ->update(['estado_servicio_id' => $estadoId]);
                }
            }

            // 1.2 Plan por (nombre_plan, velocidad_mbps).
            $llave = $servicio->plan_nombre.'|'.$servicio->velocidad_mbps;

            if (! array_key_exists($llave, $planIds)) {
                $planIds[$llave] = DB::table('planes_internet')->insertGetId([
                    'nombre_plan'    => $servicio->plan_nombre,
                    'velocidad_mbps' => (int) $servicio->velocidad_mbps,
                    'precio_mensual' => $servicio->precio_mensual,
                    'descripcion'    => 'Plan migrado desde servicios_internet (etapa 1 de planes).',
                    'activo'         => true,
                    'created_at'     => $now,
                    'updated_at'     => $now,
                ]);
            }

            // 1.3 Asignación inicial (histórica). El precio exacto del servicio
            //     se conserva en `precio_aplicado`.
            $yaTieneAsignacion = DB::table('asignaciones_plan')
                ->where('servicio_id', $servicio->id)
                ->exists();

            if (! $yaTieneAsignacion) {
                $fechaInicio = $servicio->fecha_activacion
                    ?: $servicio->fecha_instalacion
                    ?: ($servicio->created_at ? substr($servicio->created_at, 0, 10) : $now->toDateString());

                DB::table('asignaciones_plan')->insert([
                    'servicio_id'    => $servicio->id,
                    'plan_id'        => $planIds[$llave],
                    // No se conoce el autor original: no se inventa.
                    'user_id'        => null,
                    'fecha_inicio'   => $fechaInicio,
                    'fecha_fin'      => null,
                    'precio_aplicado'=> $servicio->precio_mensual,
                    'motivo_cambio'  => 'Migración inicial de datos (autor no registrado).',
                    'created_at'     => $now,
                    'updated_at'     => $now,
                ]);
            }
        }
    }

    public function down(): void
    {
        // No se revierte: borrar las asignaciones/planes migrados perdería
        // historial. Si se requiere revertir, hacerlo de forma manual y
        // consciente.
    }
};
