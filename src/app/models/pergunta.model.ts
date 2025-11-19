export class Pergunta {
  constructor(
    public id: number,
    public pergunta: string,
    public opcoes: string[],
    public resposta: string,
    public categoria: string,
    public dificuldade: string
  ) {}
}
