import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";;
import { Camera, CheckIcon, Play, StopCircle } from "lucide-react";
import { Input } from "@/components/ui/input";
import { ButtonGroup } from "@/components/ui/ButtonGroup";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export const DialogNoProductiva = () => {
  const [value, setValue] = useState("iniciar");

  const option = [
    { label: "Iniciar", value: "iniciar", icon: <Play /> },
    { label: "Detener", value: "detener", icon: <StopCircle /> },
    { label: "Finalizar", value: "finalizar", icon: <CheckIcon /> },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Detalle de la tarea - {"Inspeccion Calidad"}</CardTitle>
        <CardDescription>Tarea: {"Limpieza de Bahia"}</CardDescription>
      </CardHeader>
      <CardContent>
        <form className="space-y-2" action="">
          <div className="flex gap-2">
            <Input placeholder="Placa o vehiculo" />
          </div>
          <div className="flex justify-between items-center">
            <ul className="grid font-semibold text-sm">
              <li className="font-semibold">
                Nombre del cliente:{" "}
                <span className="font-light">{"Adolfo Mora"}</span>
              </li>
              <li>
                Fecha y hora de fin:{" "}
                <span className="font-light">{"22/04/2025 15:30"}</span>
              </li>
              <li>
                Fecha y hora de inicio real:{" "}
                <span className="font-light"> {"21/04/2025 15:50"}</span>
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
  );
};
