import { Button } from "@/components/ui/button";
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
import { Textarea } from "@/components/ui/textarea";
import { Camera, } from "lucide-react";

export const DialogInspeccionCalidad = () => {
  return (
	   <Card>
      <CardHeader>
        <CardTitle>Detalle de la tarea - {"Inspeccion Calidad"}</CardTitle>
        <CardDescription>Tarea: {"Calidad a vehiculo"}</CardDescription>
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
                {"Mantenimiento de 10,000KM"}
              </li>
              <li>
                {"Alineacion y Balanceo"}
              </li>
              <li>
                {"Aceite Sintetico"}
              </li>
              <li>
                {"Frenos y discos"}
              </li>
            </ul>
            <div>
              <Button type="button">
                <Camera />
              </Button>
            </div>
          </div>
          <div className="space-y-1 flex gap-2">
          </div>
          <Button type="button" className="w-full">
            Inspeccion de entrega
          </Button>
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
