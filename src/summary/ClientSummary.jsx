import { User } from 'lucide-react';

import { SummarySection } from './SummarySection';
import { languages } from '../data/languages';

/**
 * @param {string} section - App section, used for navigation
 * @param {Object} client - Order client
 */
export function ClientSummary({ section, client }) {

  const clientAddress = client.address + ', ' + client.postcode + ', ' + client.city;
  const clientLanguage = languages.find(l => l.value === client.language)?.label;

  const isClientVisible = client.name || client.nif || client.address || client.phone || client.email;
  const hasContactInfo = client.phone || client.email;

  if (!isClientVisible) return null;

  return (
    <SummarySection to={`${section}/cliente`} title="Cliente" icon={User}>
      <div className="space-y-1 text-sm">
        <p>{client.name} {client.nif && `(${client.nif})`}</p>
        <p>{client.address && clientAddress}</p>
        {hasContactInfo && (
          <>
            <p>{client.phone}{(client.phone && client.email) && ', '}{client.email}</p>
            <p>Idioma: {clientLanguage}</p>
          </>
        )}
      </div>
    </SummarySection>
  );
}