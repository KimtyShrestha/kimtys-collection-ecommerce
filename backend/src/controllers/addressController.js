import {
  listAddresses,
  createAddress,
  updateAddress,
  deleteAddress,
} from '../services/addressService.js'
import { sendSuccess } from '../utils/response.js'

export async function getAddresses(req, res, next) {
  try {
    const addresses = await listAddresses(req.user.id)
    sendSuccess(res, { message: 'Addresses retrieved successfully.', data: { addresses } })
  } catch (error) {
    next(error)
  }
}

export async function postAddress(req, res, next) {
  try {
    const address = await createAddress(req.user.id, req.body)
    sendSuccess(res, { statusCode: 201, message: 'Address added successfully.', data: { address } })
  } catch (error) {
    next(error)
  }
}

export async function putAddress(req, res, next) {
  try {
    const address = await updateAddress(req.user.id, req.params.id, req.body)
    sendSuccess(res, { message: 'Address updated successfully.', data: { address } })
  } catch (error) {
    next(error)
  }
}

export async function removeAddress(req, res, next) {
  try {
    await deleteAddress(req.user.id, req.params.id)
    sendSuccess(res, { message: 'Address deleted successfully.' })
  } catch (error) {
    next(error)
  }
}