<?php

namespace App\Http\Controllers\CU02_BitacoraAuditoria;

use App\Http\Controllers\Controller;
use App\Models\CU02_BitacoraAuditoria\BitacoraAuditoria;
use App\Traits\ApiResponse;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class AuditoriaController extends Controller
{
    use ApiResponse;

    /**
     * CU02 - Consultar bitácora de auditoría con filtros
     */
    public function index(Request $request): JsonResponse
    {
        $query = BitacoraAuditoria::with('user:id,name,email');

        if ($request->filled('modulo')) {
            $query->where('modulo', $request->input('modulo'));
        }

        if ($request->filled('accion')) {
            $query->where('accion', $request->input('accion'));
        }

        if ($request->filled('fecha_desde')) {
            $query->whereDate('created_at', '>=', $request->input('fecha_desde'));
        }

        if ($request->filled('fecha_hasta')) {
            $query->whereDate('created_at', '<=', $request->input('fecha_hasta'));
        }

        $logs = $query->latest()->paginate(20);

        return $this->success($logs, 'Bitácora de auditoría consultada correctamente.');
    }

    /**
     * Registrar entrada en bitácora (método estático auxiliar)
     */
    public static function registrar(string $modulo, string $accion, string $detalles, ?array $previos = null, ?array $nuevos = null): void
    {
        BitacoraAuditoria::create([
            'user_id'       => auth()->id(),
            'modulo'        => $modulo,
            'accion'        => $accion,
            'detalles'      => $detalles,
            'ip_origen'     => request()->ip(),
            'datos_previos' => $previos,
            'datos_nuevos'  => $nuevos,
        ]);
    }
}
