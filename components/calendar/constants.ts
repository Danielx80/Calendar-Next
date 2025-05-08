export const HOUR_COLUMN_WIDTH = 64;
export const USER_COL_WIDTH = 170

/** 1. Operaciones y sus colores */
export type OperationKey =
  | "mantenimiento"
  | "diagnostico"
  | "reparacion"
  | "calidadAuditoria"
  | "alineacionBalanceo"
  | "noProductivas"
  | "hojalateriaPintura"
  | "recepcionVehiculo"
  | "entregaVehiculo"
  | "lavado";

export interface OperationColor {
  title: string;
  color: string;
}

export const OPERATION_COLORS: Record<OperationKey, OperationColor> = {
  mantenimiento:      { title: "Mantenimiento",            color: "#D4EDDA" },
  diagnostico:        { title: "Diagnóstico",              color: "#F7D97E" },
  reparacion:         { title: "Reparación",                color: "#3D8AF7" },
  calidadAuditoria:   { title: "Calidad y auditoría",       color: "#FFA382" },
  alineacionBalanceo: { title: "Alineación y Balanceo",     color: "#A370F7" },
  noProductivas:      { title: "No productivas",           color: "#D6D6D6" },
  hojalateriaPintura: { title: "Hojalatería y pintura",     color: "#08BDBA" },
  recepcionVehiculo:  { title: "Recepción Vehículo",       color: "#A7F0BA" },
  entregaVehiculo:    { title: "Entrega Vehículo",         color: "#42BE65" },
  lavado:             { title: "Lavado",                   color: "#82CFFF" },
};

/** 2. Perfiles de usuario y las operaciones que pueden realizar */
export type ProfileKey =
  | "tecnicoAprendiz"
  | "tecnico"
  | "tecnicoMaestro"
  | "asesor"
  | "lavador"
  | "calidad"
  | "tecnicoHyP";

export const PROFILE_OPERATIONS: Record<ProfileKey, OperationKey[]> = {
  tecnicoAprendiz: ["mantenimiento", "noProductivas"],
  tecnico: [
    "mantenimiento",
    "alineacionBalanceo",
    "diagnostico",
    "noProductivas",
  ],
  tecnicoMaestro: [
    "mantenimiento",
    "alineacionBalanceo",
    "diagnostico",
    "reparacion",
    "noProductivas",
  ],
  asesor: ["recepcionVehiculo", "entregaVehiculo", "noProductivas"],
  lavador: ["lavado", "noProductivas"],
  calidad: ["calidadAuditoria", "noProductivas"],
  tecnicoHyP: ["hojalateriaPintura", "noProductivas"],
};

/** 3. Estados de tareas, su color y un placeholder de icono */
export type TaskStatusKey =
  | "pendiente"
  | "iniciada"
  | "terminada"
  | "reiniciado"
  | "retrabajoRechazado"
  | "detenidoRefacciones"
  | "trabajoOtroTaller"
  | "detenidoProceso"
  | "detenidoCarryOver";

export interface TaskStatusInfo {
  label: string;
  color: string;
  icon: string; // aquí podrías poner el nombre de tu librería de iconos
}

export const TASK_STATUS_INFO: Record<TaskStatusKey, TaskStatusInfo> = {
  pendiente: {
    label: "Pendiente",
    color: "",
    icon: "icon-pending",
  },
  iniciada: {
    label: "Iniciada",
    color: "#A8C6FA",
    icon: "icon-play",
  },
  terminada: {
    label: "Terminada",
    color: "#35978F",
    icon: "icon-check",
  },
  reiniciado: {
    label: "Reiniciado",
    color: "#D7EB5A",
    icon: "icon-restart",
  },
  retrabajoRechazado: {
    label: "Retrabajo/Rechazado",
    color: "#E61610",
    icon: "icon-warning",
  },
  detenidoRefacciones: {
    label: "Detenido Refacciones",
    color: "#CC9A06",
    icon: "icon-pause",
  },
  trabajoOtroTaller: {
    label: "Trabajo en Otro Taller",
    color: "#A370F7",
    icon: "icon-external",
  },
  detenidoProceso: {
    label: "Detenido Proceso",
    color: "#D6D6D6",
    icon: "icon-stop",
  },
  detenidoCarryOver: {
    label: "Detenido Carry Over",
    color: "#D68227",
    icon: "icon-carry",
  },
};

/** 4. Acciones disponibles según tipo de operación */
export const OPERATION_ACTIONS: Record<OperationKey, string[]> = {
  mantenimiento: [
    "Iniciar",
    "Detener",
    "Reiniciar",
    "Finalizar",
    "Mover",
    "Modificar duración",
    "Borrar",
    "Agregar comentario",
  ],
  diagnostico: [
    "Iniciar",
    "Detener",
    "Reiniciar",
    "Finalizar",
    "Mover",
    "Modificar duración",
    "Borrar",
    "Agregar comentario",
  ],
  reparacion: [
    "Iniciar",
    "Detener",
    "Reiniciar",
    "Finalizar",
    "Mover",
    "Modificar duración",
    "Borrar",
    "Agregar comentario",
  ],
  calidadAuditoria: ["Iniciar", "Detener", "Reiniciar", "Finalizar", "Autorizar", "Rechazar"],
  alineacionBalanceo: [
    "Iniciar",
    "Detener",
    "Reiniciar",
    "Finalizar",
    "Mover",
    "Modificar duración",
    "Borrar",
    "Agregar comentario",
  ],
  noProductivas: [
    "Iniciar",
    "Finalizar",
    "Mover",
    "Modificar duración",
    "Borrar",
    "Agregar comentario",
  ],
  hojalateriaPintura: [
    "Iniciar",
    "Detener",
    "Reiniciar",
    "Finalizar",
    "Mover",
    "Modificar duración",
    "Borrar",
    "Agregar comentario",
  ],
  recepcionVehiculo: [
    "Iniciar",
    "Finalizar",
    "Mover",
    "Modificar duración",
    "Borrar",
    "Agregar comentario",
  ],
  entregaVehiculo: [
    "Iniciar",
    "Finalizar",
    "Mover",
    "Modificar duración",
    "Borrar",
    "Agregar comentario",
  ],
  lavado: [
    "Iniciar",
    "Detener",
    "Reiniciar",
    "Finalizar",
    "Mover",
    "Modificar duración",
    "Borrar",
    "Agregar comentario",
  ],
};
