import { MessageSquare } from 'lucide-react';
import { SummarySection } from './SummarySection';

export default function OrderComment({ comment, orderActions, disabled = false }) {
  return (
    <SummarySection title="Comentarios" icon={MessageSquare}>
      <textarea
        value={comment}
        onChange={(event) => orderActions.updateComment(event.target.value)}
        rows="3"
        className="w-full p-2 text-sm bg-gray-50 rounded border-2 border-gray-300"
        disabled={disabled}
      />
    </SummarySection>
  );
}
