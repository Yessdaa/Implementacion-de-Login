document.addEventListener('DOMContentLoaded', () => {
   
    const forms = document.querySelectorAll('[id^="addToCartForm_"]'); 

    
    forms.forEach(form => {
        form.addEventListener('submit', async (event) => {
            event.preventDefault();
            const formData = new FormData(form);
            const productId = formData.get('productId');       

            try {
                console.log(productId)
                const response = await fetch(`/api/cart/65f876cd9f4c7511685b10fd/products/${productId}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json'
                    }
                });

                if (!response.ok) {
                    throw new Error('Error al agregar al carrito');
                }          

            } catch (error) {
                console.error('Error:', error);
            }
        });
    });
});