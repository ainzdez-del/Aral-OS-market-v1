export const SIZES = ['XS', 'S', 'M', 'L', 'XL'] as const
export type Size = (typeof SIZES)[number]

export type Product = {
  id: string
  sku: string
  name: string
  line: string
  price: number
  currency: string
  image: string
  hoverImage?: string
  span: string
  story: string
  fabric: string
}

export type Look = {
  id: string
  title: string
  caption: string
  image: string
  productIds: string[]
}

export const products: Product[] = [
  {
    id: 'nadir-coat',
    sku: 'ARAL-01',
    name: 'Nadir Coat',
    line: 'Архитектурное пальто',
    price: 2480,
    currency: '€',
    image:
      'https://images.unsplash.com/photo-1539533018447-63fcce2678e3?auto=format&fit=crop&w=1600&q=80',
    hoverImage:
      'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=1600&q=80',
    span: 'md:col-span-4 md:row-span-2',
    story: 'Силуэт, собранный как корпус устройства: одно полотно, скрытые швы, вес как у титана.',
    fabric: 'Wool-silk laminate · 312 g/m²',
  },
  {
    id: 'meridian-trouser',
    sku: 'ARAL-07',
    name: 'Meridian Trouser',
    line: 'Вертикаль шага',
    price: 890,
    currency: '€',
    image:
      'https://images.unsplash.com/photo-1594938291221-94f18cbbded0?auto=format&fit=crop&w=1200&q=80',
    span: 'md:col-span-2',
    story: 'Стрелка держит геометрию весь день. Ткань помнит форму, а не складки.',
    fabric: 'High-twist wool · memory crease',
  },
  {
    id: 'ion-knit',
    sku: 'ARAL-12',
    name: 'Ion Knit',
    line: 'Термальный рельеф',
    price: 640,
    currency: '€',
    image:
      'https://images.unsplash.com/photo-1434389676471-646d825adaa3?auto=format&fit=crop&w=1200&q=80',
    span: 'md:col-span-2',
    story: 'Петля вяжется плотнее к телу — тепло без объёма, как второй контур кожи.',
    fabric: 'Merino-cashmere 18.5μ',
  },
  {
    id: 'vapor-shirt',
    sku: 'ARAL-04',
    name: 'Vapor Shirt',
    line: 'Свет на ткани',
    price: 520,
    currency: '€',
    image:
      'https://images.unsplash.com/photo-1596755094514-f87e34085b83?auto=format&fit=crop&w=1400&q=80',
    hoverImage:
      'https://images.unsplash.com/photo-1489987707025-afc232f7ea71?auto=format&fit=crop&w=1400&q=80',
    span: 'md:col-span-3',
    story: 'Хлопок каландрирован до шёлка. Блик скользит, а не ломается.',
    fabric: 'Egyptian cotton · liquid calendaring',
  },
  {
    id: 'orbit-boot',
    sku: 'ARAL-19',
    name: 'Orbit Boot',
    line: 'Опора коллекции',
    price: 1120,
    currency: '€',
    image:
      'https://images.unsplash.com/photo-1608256246200-53e635b5b65f?auto=format&fit=crop&w=1200&q=80',
    span: 'md:col-span-3',
    story: 'Подошва как шасси. Кожа — матовый графит, фурнитура спрятана.',
    fabric: 'Calf leather · rubber chassis',
  },
]

export const looks: Look[] = [
  {
    id: 'look-01',
    title: 'Look 01 · City Silence',
    caption: 'Пальто Nadir + вертикаль Meridian. Город как студия.',
    image:
      'https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=1400&q=80',
    productIds: ['nadir-coat', 'meridian-trouser'],
  },
  {
    id: 'look-02',
    title: 'Look 02 · White Noise',
    caption: 'Vapor Shirt как источник света в кадре.',
    image:
      'https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&w=1400&q=80',
    productIds: ['vapor-shirt', 'meridian-trouser'],
  },
  {
    id: 'look-03',
    title: 'Look 03 · Thermal',
    caption: 'Ion Knit под пальто. Слои без шума.',
    image:
      'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=1400&q=80',
    productIds: ['ion-knit', 'nadir-coat'],
  },
  {
    id: 'look-04',
    title: 'Look 04 · Night Orbit',
    caption: 'Полный контур: ткань, шаг, опора.',
    image:
      'https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=1400&q=80',
    productIds: ['nadir-coat', 'orbit-boot'],
  },
]

export const fabricSpecs = [
  {
    kicker: '01  /  Волокно',
    title: 'Шерсть как проводник',
    body: 'Длинное волокно мериноса держит воздух в микроканалах. Тепло не накапливается слоями — оно распределяется, как ток по плате.',
  },
  {
    kicker: '02  /  Ламинация',
    title: 'Два слоя, одна поверхность',
    body: 'Шёлк сваривается с шерстью при низкой температуре. Снаружи — жидкий блик, внутри — тишина. Швы спрятаны, как кабель в корпусе.',
  },
  {
    kicker: '03  /  Память формы',
    title: 'Ткань, которая помнит',
    body: 'High-twist пряжа возвращает силуэт после движения. Изделие не мнётся — оно калибруется обратно к чертежу.',
  },
]

export function formatPrice(price: number, currency = '€') {
  return `${currency}${price.toLocaleString('en-US')}`
}

export function productById(id: string) {
  return products.find((item) => item.id === id)
}
