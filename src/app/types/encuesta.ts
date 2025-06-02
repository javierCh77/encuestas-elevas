export interface RespuestaEncuestaDTO {
  fecha: string;
  colaborador: string;
  respuestas: {
    pregunta: string;
    valor: number;
  }[];
}
