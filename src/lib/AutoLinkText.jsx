import { Fragment } from "react";
import PropTypes from "prop-types";

/**
 * AutoLinkText component automatically converts URLs in text to clickable links
 *
 * @param {Object} props - Component props
 * @param {string} props.text - The text to process for links
 * @param {string} props.className - Optional className to apply to the text
 * @returns {JSX.Element} - Fragment containing text with clickable links
 */
const AutoLinkText = ({ text, className }) => {
  if (!text) return null;

  // Regular expression to match URLs
  // This regex matches common URL patterns starting with http://, https://, www.
  const urlRegex = /(https?:\/\/[^\s]+)|(www\.[^\s]+)/g;

  // Split the text by URLs and create an array of text and link elements
  const parts = [];
  let lastIndex = 0;
  let match;

  while ((match = urlRegex.exec(text)) !== null) {
    if (match.index > lastIndex) {
      parts.push(text.slice(lastIndex, match.index));
    }

    const url = match[0];
    const href = url.startsWith("www.") ? `https://${url}` : url;

    parts.push(
      <a
        key={match.index}
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className="text-blue-600 hover:underline"
      >
        {url}
      </a>
    );

    lastIndex = match.index + url.length;
  }

  if (lastIndex < text.length) {
    parts.push(text.slice(lastIndex));
  }

  return (
    <span className={className}>
      {parts.map((part, i) => (
        <Fragment key={i}>{part}</Fragment>
      ))}
    </span>
  );
};

AutoLinkText.propTypes = {
  text: PropTypes.string.isRequired,
  className: PropTypes.string,
};

export default AutoLinkText;
