import React from 'react'

const CheckoutCard = ({ cartData }) => {
    console.log(cartData)
    // Function to calculate total price of each item
    const calculateTotalPrice = (item) => {
        return item.quantity * item.price;
    };
  
    // Calculate sum of total prices using reduce
    const sumTotalPrices = Array.isArray(cartData) ? cartData.reduce((total, item) => {
        return total + calculateTotalPrice(item);
    }, 0) : 0;

    // Calculate shipping cost
    const shippingCost = 0;

    // Handle checkout
    const handleCheckout = () => {
        // Add your checkout logic here
        console.log('Processing checkout for:', cartData);
    };

    return (
        <div className='px-4 py-4 bg-white rounded-md'>
            <h1 className='mb-2 text-lg font-semibold text-gray-800'>Order Summary</h1>
            <div>
                <div className='flex justify-between my-3 border-b-2 py-4 text-gray-600 font-semibold text-sm'>
                    <h1>Sub Total :</h1>
                    <p>Rs {sumTotalPrices.toFixed(2)}</p>
                </div>
                <div className='flex justify-between my-3 border-b-2 py-4 text-gray-600 font-semibold text-sm'>
                    <h1>Shipping cost :</h1>
                    <p>Rs {shippingCost}.00</p>
                </div>
                <div className='flex justify-between my-3 border-b-2 py-4 text-gray-600 font-semibold text-sm'>
                    <h1>Tax estimate :</h1>
                    <p>Rs 0.00</p>
                </div>
                <div className='flex justify-between my-4 py-4 text-gray-800 font-semibold'>
                    <h1>Order Total :</h1>
                    <p>Rs {(sumTotalPrices + shippingCost).toFixed(2)}</p>
                </div>

            </div>
        </div>
    )
}

export default CheckoutCard