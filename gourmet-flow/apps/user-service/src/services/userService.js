import { v4 as uuidv4 } from 'uuid';

const users = new Map();
const addresses = new Map();

function seed() {
  const userId = 'u1';
  users.set(userId, {
    id: userId,
    name: 'Alessia Romano',
    email: 'alessia@example.com',
    phone: '+39 333 456 7890',
  });

  const addr1 = {
    id: 'a1',
    userId,
    label: 'Home',
    street: 'Via del Corso 12',
    city: 'Rome',
    details: 'Interior 4B, 3rd Floor',
    default: true,
  };
  const addr2 = {
    id: 'a2',
    userId,
    label: 'Office',
    street: 'Piazza Navona 44',
    city: 'Rome',
    details: 'Global Innovations Hub',
    default: false,
  };

  addresses.set('a1', addr1);
  addresses.set('a2', addr2);
}

seed();

export function getProfile(userId) {
  const user = users.get(userId);
  if (!user) {
    const err = new Error('User not found');
    err.statusCode = 404;
    err.code = 'USER_NOT_FOUND';
    throw err;
  }
  return { ...user };
}

export function updateProfile(userId, updates) {
  const user = users.get(userId);
  if (!user) {
    const err = new Error('User not found');
    err.statusCode = 404;
    err.code = 'USER_NOT_FOUND';
    throw err;
  }

  if (updates.name !== undefined) user.name = updates.name;
  if (updates.email !== undefined) user.email = updates.email;
  if (updates.phone !== undefined) user.phone = updates.phone;

  return { ...user };
}

export function getAddresses(userId) {
  const user = users.get(userId);
  if (!user) {
    const err = new Error('User not found');
    err.statusCode = 404;
    err.code = 'USER_NOT_FOUND';
    throw err;
  }

  const userAddresses = Array.from(addresses.values()).filter((a) => a.userId === userId);
  return userAddresses;
}

export function createAddress(userId, data) {
  const user = users.get(userId);
  if (!user) {
    const err = new Error('User not found');
    err.statusCode = 404;
    err.code = 'USER_NOT_FOUND';
    throw err;
  }

  const id = uuidv4();
  const address = {
    id,
    userId,
    label: data.label,
    street: data.street,
    city: data.city,
    details: data.details || '',
    default: data.default || false,
  };

  if (address.default) {
    for (const addr of addresses.values()) {
      if (addr.userId === userId) addr.default = false;
    }
  }

  addresses.set(id, address);
  return { ...address };
}

export function updateAddress(userId, addressId, data) {
  const address = addresses.get(addressId);
  if (!address || address.userId !== userId) {
    const err = new Error('Address not found');
    err.statusCode = 404;
    err.code = 'ADDRESS_NOT_FOUND';
    throw err;
  }

  if (data.label !== undefined) address.label = data.label;
  if (data.street !== undefined) address.street = data.street;
  if (data.city !== undefined) address.city = data.city;
  if (data.details !== undefined) address.details = data.details;

  if (data.default === true) {
    for (const addr of addresses.values()) {
      if (addr.userId === userId && addr.id !== addressId) addr.default = false;
    }
    address.default = true;
  } else if (data.default === false) {
    address.default = false;
  }

  return { ...address };
}

export function deleteAddress(userId, addressId) {
  const address = addresses.get(addressId);
  if (!address || address.userId !== userId) {
    const err = new Error('Address not found');
    err.statusCode = 404;
    err.code = 'ADDRESS_NOT_FOUND';
    throw err;
  }

  addresses.delete(addressId);
  return { message: 'Address deleted successfully' };
}
