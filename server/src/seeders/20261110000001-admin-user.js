// server/src/seeders/20261110000001-admin-user.js
'use strict';

const bcrypt = require('bcryptjs');

module.exports = {
  async up(queryInterface) {
    const [[{ count }]] = await queryInterface.sequelize.query(
      'SELECT COUNT(*) AS count FROM users'
    );
    if (Number(count) > 0) return;

    const adminPasswordHash = await bcrypt.hash('Admin@123', 10);
    const userPasswordHash = await bcrypt.hash('User@123', 10);

    await queryInterface.bulkInsert('users', [
      {
        id: 1,
        email: 'admin@calemstudio.vn',
        password_hash: adminPasswordHash,
        full_name: 'Quản Trị Viên Calem',
        phone: '0901234567',
        avatar_url: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=300&q=80',
        role: 'admin',
        is_active: true,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        id: 2,
        email: 'khachhang@calemstudio.vn',
        password_hash: userPasswordHash,
        full_name: 'Nguyễn Minh Anh',
        phone: '0987654321',
        avatar_url: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=300&q=80',
        role: 'user',
        is_active: true,
        created_at: new Date(),
        updated_at: new Date(),
      },
    ]);

    await queryInterface.bulkInsert('carts', [
      { id: 1, user_id: 1, created_at: new Date(), updated_at: new Date() },
      { id: 2, user_id: 2, created_at: new Date(), updated_at: new Date() },
    ]);

    await queryInterface.bulkInsert('addresses', [
      {
        id: 1,
        user_id: 2,
        recipient_name: 'Nguyễn Minh Anh',
        recipient_phone: '0987654321',
        province: 'TP. Hồ Chí Minh',
        district: 'Quận 1',
        ward: 'Phường Bến Nghé',
        street_address: '125 Lê Lợi, Tòa nhà Saigon Studio',
        is_default: true,
        created_at: new Date(),
        updated_at: new Date(),
      },
    ]);
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete('addresses', null, {});
    await queryInterface.bulkDelete('carts', null, {});
    await queryInterface.bulkDelete('users', null, {});
  },
};
