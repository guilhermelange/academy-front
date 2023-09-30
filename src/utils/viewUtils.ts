export function formatDate(date: Date): string {
    const day = String(date.getUTCDate()).padStart(2, '0');
    const month = String(date.getUTCMonth() + 1).padStart(2, '0');
    const year = String(date.getUTCFullYear());

    return `${day}/${month}/${year}`;
}

export function formatDateTime(date: Date): string {
  return `${formatDate(date)} ${date.toLocaleTimeString()}`;
}

export function formatValue(value: number) {
    // Utilize toLocaleString() com opções para formatar o número em Reais
    return value.toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    });
  }