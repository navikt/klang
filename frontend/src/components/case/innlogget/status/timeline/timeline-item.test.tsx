import { describe, expect, test } from 'bun:test';
import { TimelineItem } from '@app/components/case/innlogget/status/timeline/timeline-item';
import { FileIcon } from '@navikt/aksel-icons';
import { render, screen } from '@testing-library/react';

describe('TimelineItem', () => {
  describe('should render correctly', () => {
    render(<TimelineItem title="Heading" date="2024-11-30" icon={<FileIcon />} />);

    test('heading', () => {
      expect(screen.getByText(/Heading/)).toBeDefined();
    });

    test('date', () => {
      expect(screen.getByText(/30.11.2024/)).toBeDefined();
    });
  });
});
