import { createServer } from 'http';
import { createApp, defineEventHandler, getMethod, getQuery, toNodeListener, eventHandler } from 'h3';
import { PrismaClient } from '@prisma/client';

// Initialize Prisma client
const prisma = new PrismaClient();

// Initialize h3 app
const app = createApp();

// Middleware to add CORS headers
app.use(eventHandler((event) => {
  event.node.res.setHeader('Access-Control-Allow-Origin', '*');
  event.node.res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  event.node.res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  // Handle preflight (OPTIONS) requests
  if (event.node.req.method === 'OPTIONS') {
    event.node.res.statusCode = 204;
    event.node.res.end();
  }
}));

// Define the /api/transaction route
app.use('/api/transaction', defineEventHandler(async (event) => {
  const method = getMethod(event);

  if (method === 'GET') {
    // Get query parameters
    const { date, amount, notes, code, bank, limit, page, searchTerm } = getQuery(event);

    // Prepare filter object
    const filter: any = {};
    if (date) filter.date = new Date(date as string);
    if (amount) filter.amount = parseFloat(amount as string);
    if (notes) filter.notes = { contains: notes };
    if (code) filter.code = code;
    if (bank) filter.bank = bank;
    if (searchTerm) {
      filter.OR = [
        { notes: { contains: searchTerm as string } },
        { code: { contains: searchTerm as string } },
        { bank: { contains: searchTerm as string } }
      ];
    }

    // Parse limit and page
    const parsedLimit = limit ? parseInt(limit as string) : 10;
    const parsedPage = page ? parseInt(page as string) : 1;
    const skip = (parsedPage - 1) * parsedLimit;

    // Fetch transactions based on filter with pagination
    const transactions = await prisma.transaction.findMany({
      where: filter,
      take: parsedLimit,
      skip: skip,
      orderBy: { date: 'desc' },
    });

    // Get total count for pagination
    const totalCount = await prisma.transaction.count({ where: filter });

    return {
      transactions,
      totalCount,
      currentPage: parsedPage,
      totalPages: Math.ceil(totalCount / parsedLimit),
    };
  }
}));

// Start the server
const server = createServer(toNodeListener(app));

server.listen(3001, () => {
  console.log('API Server is running on http://localhost:3001');
});
