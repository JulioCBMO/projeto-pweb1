export interface Pergunta {
  id?: number;
  texto: string;
  alternativas: string[];
  correta: number;
  imagem?: string | null;
}