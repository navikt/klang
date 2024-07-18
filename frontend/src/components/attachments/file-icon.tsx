import { FileTextIcon, ImageIcon } from '@navikt/aksel-icons';

interface FileIconProps {
  contentType: string;
}

export const FileIcon = ({ contentType }: FileIconProps) => {
  if (contentType.includes('image')) {
    return <ImageIcon aria-hidden />;
  }

  return <FileTextIcon aria-hidden />;
};
