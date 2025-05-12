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


export const DialogRecepcionVehiculo = () => {
  return (
	    <Card>
      <CardHeader>
        <CardTitle>Detalle de la tarea - {"Recepcion Vehiculo"}</CardTitle>
        <CardDescription>Tarea: {"Recepcion del Vehiculo"}</CardDescription>
      </CardHeader>
      <CardContent>
        <form className="space-y-2" action="">
          <div className="flex gap-2">
            <Input placeholder="No Aplica - APK598" />
            <Button className="w-[65%]">Historico servicios</Button>
          </div>
          <div className="flex justify-between items-center">
            <ul className="grid font-semibold text-sm">
              <li className="font-semibold">
                Nombre del cliente:{" "}
                <span className="font-light">{"Adolfo Mora"}</span>
              </li>
              <li>
                Hora cita: <span className="font-light">{"15:30"}</span>
              </li>
              <li>
                Servicio o motivo de cita:{" "}
                <ul className="list-disc ml-15 font-light">
                  <li>{"Mantenimiento de 10,000km Versa Advance"}</li>
                  <li>{"Alineacion y balanceo"}</li>
                  <li>{"Nitrogeno en llantas"}</li>
                  <li>{"Aceite sintetico"}</li>
                </ul>
              </li>
            </ul>
          </div>
          <Button type="button" className="w-full">Inventario y creacion de orden</Button>
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
