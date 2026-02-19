/**
 * Filter out videos with specific keywords in the title
 * @param {Array} videos - Array of video objects
 * @param {Array} excludeKeywords - Keywords to filter out (default: ['fireside', 'watercooler'])
 * @returns {Array} Filtered array of videos
 */
export const filterVideos = (
  videos,
  excludeKeywords = ["fireside", "watercooler"]
) => {
  return videos.filter((video) => {
    const title = video.title.toLowerCase();
    return !excludeKeywords.some((keyword) =>
      title.includes(keyword.toLowerCase())
    );
  });
};
