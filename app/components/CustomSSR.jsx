export default async function CustomSSR() {
  const later = (delay, value) =>
    new Promise((resolve) => setTimeout(resolve, delay, value));

  return later(5000, 'Test');
}
