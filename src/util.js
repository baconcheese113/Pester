export const stripEmojis = text => {
  return text.replace(
    /([\uE000-\uF8FF]|\uD83C[\uDC00-\uDFFF]|\uD83D[\uDC00-\uDFFF]|[\u2011-\u26FF]|\uD83E[\uDD10-\uDDFF])/g,
    ""
  );
};

export const stripSpaces = text => {
  return text.replace(" ", "");
};

// Breaking on linebreaks cause 🤷
export const breakIntoMsgChunks = (str, maxChunkSize = 1500) => {
  return str.split("\n").reduce((prev, cur) => {
    const l = prev.length;
    if (!l) return [cur];
    if (prev[l - 1].length + cur.length > maxChunkSize) return [...prev, cur];
    prev[l - 1] = `${prev[l - 1]}${cur}\n`;
    return prev;
  }, []);
};
