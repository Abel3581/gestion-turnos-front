export interface Page<T> {
  content: T[];        // La lista de elementos para la página actual
  pageable: any;       // Información adicional sobre la configuración de paginación
  totalPages: number;  // Número total de páginas
  totalElements: number;  // Número total de elementos en todas las páginas
  last: boolean;       // Si esta es la última página
  size: number;        // Número de elementos en la página actual
  number: number;      // Número de la página actual
  sort: any;           // Información de ordenación
  numberOfElements: number;  // Número de elementos en la página actual
  first: boolean;      // Si esta es la primera página
  empty: boolean;      // Si la página está vacía
}
