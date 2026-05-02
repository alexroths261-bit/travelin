import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const kerala = await prisma.destination.create({
    data: { name: 'Kerala', slug: 'kerala', tagline: "God's Own Country", description: 'Backwaters, tea plantations, and Ayurvedic wellness in lush green landscapes.', image: '/destinations/kerala.jpg', rating: 4.9 },
  });
  const rajasthan = await prisma.destination.create({
    data: { name: 'Rajasthan', slug: 'rajasthan', tagline: 'Land of Kings', description: 'Majestic forts, desert safaris, and vibrant culture in India\'s royal state.', image: '/destinations/rajasthan.jpg', rating: 4.8 },
  });
  const kedarnath = await prisma.destination.create({
    data: { name: 'Kedarnath', slug: 'kedarnath', tagline: 'Uttarakhand', description: 'Sacred pilgrimage through the Himalayas.', image: '/destinations/kedarnath.jpg', rating: 4.9 },
  });
  const delhi = await prisma.destination.create({
    data: { name: 'Delhi', slug: 'delhi', tagline: 'Heart of India', description: 'Heritage monuments, bustling bazaars, and a fusion of old and new India.', image: '/destinations/delhi.jpg', rating: 4.7 },
  });
  const odisha = await prisma.destination.create({
    data: { name: 'Odisha', slug: 'odisha', tagline: 'Soul of East India', description: 'Ancient temples, tribal culture, pristine beaches, and Chilika Lake.', image: '/destinations/odisha.jpg', rating: 4.6 },
  });
  const bangalore = await prisma.destination.create({
    data: { name: 'Bangalore', slug: 'bangalore', tagline: 'Silicon Valley of India', description: 'Gardens, craft breweries, tech parks, and gateway to South India.', image: '/destinations/bangalore.jpg', rating: 4.7 },
  });

  const pkgs = [
    { d: kerala, t: 'Kerala Quick Getaway', dur: 3, p: 1999, m: 'Breakfast & Dinner', tr: 1, ap: false, c: false, f: false, l: 'Quick Getaway' },
    { d: kerala, t: 'Kerala Weekend Escape', dur: 5, p: 3499, m: 'All Meals', tr: 3, ap: true, c: false, f: false, l: 'Most Popular' },
    { d: kerala, t: 'Kerala Week Special', dur: 7, p: 4999, m: 'All Meals', tr: 5, ap: true, c: false, f: false, l: 'Week Special' },
    { d: kerala, t: 'Kerala Deep Explore', dur: 10, p: 6999, m: 'All Meals + Snacks', tr: 8, ap: true, c: true, f: false, l: 'Deep Explore' },
    { d: kerala, t: 'Kerala Ultimate Tour', dur: 15, p: 9999, m: 'All-Inclusive', tr: 12, ap: true, c: true, f: true, l: 'Ultimate Tour' },
    { d: rajasthan, t: 'Rajasthan Quick Getaway', dur: 3, p: 2499, m: 'Breakfast & Dinner', tr: 1, ap: false, c: false, f: false, l: 'Quick Getaway' },
    { d: rajasthan, t: 'Rajasthan Weekend Escape', dur: 5, p: 3999, m: 'All Meals', tr: 3, ap: true, c: false, f: false, l: 'Most Popular' },
    { d: rajasthan, t: 'Rajasthan Week Special', dur: 7, p: 5999, m: 'All Meals', tr: 5, ap: true, c: false, f: false, l: 'Week Special' },
    { d: rajasthan, t: 'Rajasthan Deep Explore', dur: 10, p: 7999, m: 'All Meals + Snacks', tr: 8, ap: true, c: true, f: false, l: 'Deep Explore' },
    { d: rajasthan, t: 'Rajasthan Ultimate Tour', dur: 15, p: 11999, m: 'All-Inclusive', tr: 12, ap: true, c: true, f: true, l: 'Ultimate Tour' },
    { d: kedarnath, t: 'Kedarnath Quick Getaway', dur: 3, p: 3499, m: 'Breakfast & Dinner', tr: 1, ap: false, c: false, f: false, l: 'Quick Getaway' },
    { d: kedarnath, t: 'Kedarnath Weekend Escape', dur: 5, p: 5499, m: 'All Meals', tr: 3, ap: true, c: false, f: false, l: 'Most Popular' },
    { d: kedarnath, t: 'Kedarnath Week Special', dur: 7, p: 7499, m: 'All Meals', tr: 5, ap: true, c: false, f: false, l: 'Week Special' },
    { d: kedarnath, t: 'Kedarnath Deep Explore', dur: 10, p: 9999, m: 'All Meals + Snacks', tr: 8, ap: true, c: true, f: false, l: 'Deep Explore' },
    { d: delhi, t: 'Delhi Quick Getaway', dur: 3, p: 1499, m: 'Breakfast & Dinner', tr: 1, ap: false, c: false, f: false, l: 'Quick Getaway' },
    { d: delhi, t: 'Delhi Weekend Escape', dur: 5, p: 2499, m: 'All Meals', tr: 3, ap: true, c: false, f: false, l: 'Most Popular' },
    { d: delhi, t: 'Delhi Week Special', dur: 7, p: 3999, m: 'All Meals', tr: 5, ap: true, c: false, f: false, l: 'Week Special' },
    { d: delhi, t: 'Delhi Deep Explore', dur: 10, p: 5999, m: 'All Meals + Snacks', tr: 8, ap: true, c: true, f: false, l: 'Deep Explore' },
    { d: delhi, t: 'Delhi Ultimate Tour', dur: 15, p: 8999, m: 'All-Inclusive', tr: 12, ap: true, c: true, f: true, l: 'Ultimate Tour' },
    { d: odisha, t: 'Odisha Quick Getaway', dur: 3, p: 1799, m: 'Breakfast & Dinner', tr: 1, ap: false, c: false, f: false, l: 'Quick Getaway' },
    { d: odisha, t: 'Odisha Weekend Escape', dur: 5, p: 2999, m: 'All Meals', tr: 3, ap: true, c: false, f: false, l: 'Most Popular' },
    { d: odisha, t: 'Odisha Week Special', dur: 7, p: 4499, m: 'All Meals', tr: 5, ap: true, c: false, f: false, l: 'Week Special' },
    { d: odisha, t: 'Odisha Deep Explore', dur: 10, p: 6499, m: 'All Meals + Snacks', tr: 8, ap: true, c: true, f: false, l: 'Deep Explore' },
    { d: bangalore, t: 'Bangalore Quick Getaway', dur: 3, p: 1899, m: 'Breakfast & Dinner', tr: 1, ap: false, c: false, f: false, l: 'Quick Getaway' },
    { d: bangalore, t: 'Bangalore Weekend Escape', dur: 5, p: 3199, m: 'All Meals', tr: 3, ap: true, c: false, f: false, l: 'Most Popular' },
    { d: bangalore, t: 'Bangalore Week Special', dur: 7, p: 4799, m: 'All Meals', tr: 5, ap: true, c: false, f: false, l: 'Week Special' },
    { d: bangalore, t: 'Bangalore Deep Explore', dur: 10, p: 6799, m: 'All Meals + Snacks', tr: 8, ap: true, c: true, f: false, l: 'Deep Explore' },
  ];

  for (const p of pkgs) {
    await prisma.package.create({
      data: { destinationId: p.d.id, title: p.t, duration: p.dur, pricePerPerson: p.p, meals: p.m, tours: p.tr, airportTransfer: p.ap, privateCab: p.c, flights: p.f, label: p.l },
    });
  }

  await prisma.user.create({
    data: { name: 'Admin', email: 'admin@travelin.in', password: 'admin123', role: 'admin' },
  });

  console.log('Seeded 6 destinations, 28 packages, 1 admin');
}

main().catch(console.error).finally(() => prisma.$disconnect());
