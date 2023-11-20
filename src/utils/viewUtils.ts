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


export function formatTime(date: Date) {
  const padlZero = (number: number) => {
    if (number < 10) {
        return "0" + number;
    } else {
        return "" + number;
    }
}

  const horas = padlZero(date.getUTCHours());
  const minutos = padlZero(date.getUTCMinutes());

  return `${horas}:${minutos}`;
}

export function getCurrentDate(): string {
  const today = new Date();

  const year = today.getFullYear();
  const month = (today.getMonth() + 1).toString().padStart(2, '0'); // Adiciona zero à esquerda se for menor que 10
  const day = today.getDate().toString().padStart(2, '0');

  const formattedDate = `${year}-${month}-${day}`;
  return formattedDate;
}