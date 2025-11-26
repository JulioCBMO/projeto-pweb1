export interface Pergunta {
  texto: string;
  alternativas: string[];
  correta: number;
  imagem?: string | null;
}