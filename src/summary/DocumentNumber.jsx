import { FileText } from 'lucide-react';

import { SummarySection } from './SummarySection';
import { SummaryIcon } from './SummaryIcon';

export default function DocumentNumber({ documentNumber }) {
  return (
    <SummarySection className="flex items-center">
      <SummaryIcon icon={FileText} />
      <strong className="font-medium mr-1">Número de documento:</strong>
      {documentNumber ? (
        documentNumber
      ) : (
        <span className="text-gray-500 italic">Pendiente</span>
      )}
    </SummarySection>
  );
}
