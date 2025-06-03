# Point of sale app prototype

This is a prototype built for a retail client in Spain. This React app allows salespeople to generate quotes, invoices and returns. You can try the live demo at:

[terencicp.github.io/pos-demo](https://terencicp.github.io/pos-demo/)

Use zoom to increase UI size and arrows to navigate back and forth between pages. Note that the final SAVE button currently has no functionality.

## Features

**Product:**
- Full-text product search
- Products can have multiple variations
- Click on the price to add discounts

**Deliveries:**
- Products can be split into:
    - Products collected at the store
    - Products that will be delivered to the client

**Form validation**:
- NIF validation
- Phone number validation
- Email validation
- City full-text search
- Fields may be mandatory under certain conditions

**Payment**:
- Unfulfilled items can be paid partially
- Cash is limited to 1000€ by law in Spain

**Quotes**:
- Switch between order and quote sections at any time

**Returns**:
- The documents section (unfinished) contains example data to try out the returns flow

## Libraries used

- **React 19**
- **Vite**
- **React Router**
- **Tailwind CSS**
- **Lucide React**
- **Material-UI**
- **Fuse.js**

## Copyright

The client has granted permission to showcase this work publicly while retaining all proprietary rights.

## Contact

For any questions regarding this project or potential collaborations, feel free to connect with me on [LinkedIn](https://www.linkedin.com/in/terenci).
