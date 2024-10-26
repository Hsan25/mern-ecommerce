import AddressController from '@controller/address.controller';
import express from 'express';
const router = express.Router();

router.get('/', AddressController.getAllAddress);
router.get('/:id', AddressController.getAddressByUser);
router.post('/:userId', AddressController.createAddress);
router.put('/:id', AddressController.updateAddress);
router.delete('/:userId/:id', AddressController.deleteAddress);
export default router;