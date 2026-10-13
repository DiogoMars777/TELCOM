<?php

namespace App\Support;

use App\Models\CU02_BitacoraAuditoria\BitacoraAuditoria;
use Throwable;

/**
 * Registro centralizado de la bitácora de auditoría (CU02).
 *
 * Todas las operaciones de escritura del sistema (CU01, CU03-CU15 y la
 * asignación de planes) llaman aquí para dejar constancia en
 * `bitacora_auditorias`. Consultar CU02 devuelve esos registros reales.
 *
 * La auditoría es "best effort": si por cualquier motivo no se puede
 * escribir (BD, permisos, etc.) NUNCA interrumpe la operación de negocio;
 * el error se reporta pero no se propaga.
 */
class AuditLogger
{
    /**
     * @param  array<string, mixed>|null  $previos  Estado anterior (para updates).
     * @param  array<string, mixed>|null  $nuevos   Estado resultante.
     */
    public static function log(
        string $modulo,
        string $accion,
        string $detalles,
        ?array $previos = null,
        ?array $nuevos = null,
        ?int $userId = null
    ): void {
        try {
            BitacoraAuditoria::create([
                'user_id'       => $userId ?? auth()->id(),
                'modulo'        => $modulo,
                'accion'        => $accion,
                'detalles'      => $detalles,
                'ip_origen'     => request()->ip(),
                'datos_previos' => $previos,
                'datos_nuevos'  => $nuevos,
            ]);
        } catch (Throwable $e) {
            report($e);
        }
    }
}
