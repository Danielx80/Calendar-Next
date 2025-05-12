import { Button } from "@/components/ui/button";
import { ButtonGroup } from "@/components/ui/ButtonGroup";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { TaskList } from "@/components/ui/TaskList";
import { Textarea } from "@/components/ui/textarea";
import { Camera, CheckIcon, PauseCircle, Play, StopCircle } from "lucide-react";
import { useState } from "react";


export const DialogMantenimiento = () => {

	 const [value, setValue] = useState("iniciar");

  const option = [
    { label: "Iniciar", value: "iniciar", icon: <Play /> },
    { label: "Pausar", value: "pausar", icon: <PauseCircle /> },
    { label: "Detener", value: "detener", icon: <StopCircle /> },
    { label: "Finalizar", value: "finalizar", icon: <CheckIcon /> },
  ];


  return (
	  <Card>
      <CardHeader>
        <CardTitle>Detalle de la tarea - {"Mantenimiento"}</CardTitle>
        <CardDescription>
          Tarea: {"Mantenimiento de 10,000km"} {"Versa Advance 1.4"}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form className="space-y-2" action="">
          <div className="flex gap-2">
            <Input placeholder="placa o vehiculo" />
            <Button type="button" className="w-[75%]">
              Ver expediente
            </Button>
          </div>
          <div className="flex justify-between items-center">
            <ul className="grid font-semibold text-sm">
              <li className="font-semibold">
                Fecha y hora de inicio:{" "}
                <span className="font-light">{"21/04/2025 15:45"}</span>
              </li>
              <li>
                Fecha y hora de fin:{" "}
                <span className="font-light">{"21/04/2025  17:05"}</span>
              </li>
              <li>
                Fecha y hora de inicio real:{" "}
                <span className="font-light"> {"21/04/2025 15:50"}</span>
              </li>
              <li>
                Fecha y hora de fin real:{" "}
                <span className="font-light">{"N/A"}</span>
              </li>
            </ul>
            <div>
              <Button type="button">
                <Camera />
              </Button>
            </div>
          </div>
          <div className="space-y-1 flex gap-2">
            <ButtonGroup
              className="w-full"
              options={option}
              value={value}
              onChange={(val) => setValue(val)}
            />
          </div>
          <Button type="button" className="w-full">
            Inspeccion multipuntos
          </Button>
          <Button type="button" className="w-full">
            Inspeccion calidad
          </Button>

          <div>
            <TaskList initialTasks={["Drenado de aceite", "Purga de Frenos"]} />
          </div>
          <div className="space-y-1">
            <Label>Comentarios o solicitudes adicionales</Label>
            <Textarea placeholder="Escribe tu comentario o solicitud" />
          </div>
        </form>
      </CardContent>
      <CardFooter>
        <Button className="w-full">Guardar</Button>
      </CardFooter>
    </Card>
  )
}
