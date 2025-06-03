import { useContext, useRef, useEffect } from 'react';

import OrderContext from '../context/OrderContext';
import FormField from './FormField';
import TextInput from './TextInput';
import CitySearch from './CitySearch';
import Dropdown from './Dropdown';
import { languages } from '../data/languages';


/**
 * @param {boolean} [props.order=false] - If the form is for an Order show more fields than Budget
 * @param {object} [props.errors={}] - Validation errors for field
 * @param {Set} [props.cities] - Valid cities for search
 */
export default function ClientForm({ order = false, errors = {}, cities }) {

  const { orderState, orderActions } = useContext(OrderContext);
  const { client } = orderState;
  const nameInputRef = useRef(null);

  function handleInputChange(event) {
    const { id, value } = event.target;
    orderActions.updateClientField(id, value);
  }

  // Focus the name input on page load if no data
  useEffect(() => {
    if (!client.name && !client.phone && !client.email) {
      nameInputRef.current.focus();
    }
    // eslint-disable-next-line
  }, []);

  return (
    <>
      <form onSubmit={(e) => e.preventDefault()}>
        <div className="grid grid-cols-2 gap-x-4">

          {/* Name */}
          <FormField label="Nombre" htmlFor="name" className={!order ? 'col-span-2' : ''}>
            <TextInput
              id="name"
              value={client.name || ''}
              onChange={handleInputChange}
              hasError={errors.name}
              ref={nameInputRef}
            />
          </FormField>

          {/* NIF */}
          {order && (
            <FormField label="NIF" htmlFor="nif">
              <TextInput
                id="nif"
                value={client.nif || ''}
                onChange={handleInputChange}
                hasError={errors.nif}
                autoComplete="off"
              />
            </FormField>
          )}

          {/* Address */}
          {order && (
            <FormField label="Dirección" htmlFor="address" className="col-span-2">
              <TextInput
                id="address"
                value={client.address || ''}
                onChange={handleInputChange}
                hasError={errors.address}
              />
            </FormField>
          )}

          {/* Post code */}
          {order && (
            <FormField label="Código postal" htmlFor="postcode">
              <TextInput
                id="postcode"
                value={client.postcode || ''}
                onChange={handleInputChange}
                hasError={errors.postcode}
              />
            </FormField>
          )}

          {/* City */}
          {order && (
            <FormField label="Ciudad" htmlFor="city">
              <CitySearch
                id="city"
                value={client.city || ''}
                onChange={handleInputChange}
                hasError={errors.city}
                cities={cities}
              />
            </FormField>
          )}

          {/* Phone */}
          <FormField label="Teléfono" htmlFor="phone">
            <div className="relative">
              <TextInput
                id="phone"
                value={client.phone || ''}
                onChange={handleInputChange}
                hasError={errors.phone}
                type="tel"
              />
            </div>
          </FormField>

          {/* Email */}
          <FormField label="Email" htmlFor="email">
            <TextInput
              id="email"
              value={client.email || ''}
              onChange={handleInputChange}
              hasError={errors.email}
              type="email"
            />
          </FormField>

          {/* Language */}
          <FormField label="Idioma" htmlFor="language" className="col-span-2">
            <Dropdown
              id="language"
              value={client.language || 'es'}
              onChange={handleInputChange}
              options={languages}
            />
          </FormField>
        </div>
      </form>
    
    </>
  );
}