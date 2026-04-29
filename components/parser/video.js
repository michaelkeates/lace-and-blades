import { Box } from '@chakra-ui/react'

export const WPVideo = ({ src }) => (
  <Box as="video" controls src={src} width="100%" borderRadius="lg" boxShadow="md" my={4} />
)

export const WPYoutube = ({ url }) => {
  // Logic to handle both standard watch links AND already-formatted embed links
  const getEmbedUrl = (videoUrl) => {
    if (!videoUrl) return null;
    
    // If it's already an embed link, just return it (but clean entities)
    if (videoUrl.includes('/embed/')) {
      return videoUrl.replace(/&amp;/g, '&');
    }

    // Otherwise, try to extract the ID from a standard watch link
    const regExp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#&?]*).*/;
    const match = videoUrl.match(regExp);
    const videoId = (match && match[7].length === 11) ? match[7] : null;
    
    return videoId ? `https://www.youtube.com/embed/${videoId}` : null;
  };

  const embedUrl = getEmbedUrl(url);

  if (!embedUrl) return null;

  return (
    <Box my={6} width="100%">
      <Box
        borderRadius="lg"
        overflow="hidden"
        boxShadow="lg"
        position="relative"
        paddingBottom="56.25%" // Responsive 16:9
        height={0}
        bg="black"
      >
        <Box
          as="iframe"
          position="absolute"
          top={0}
          left={0}
          width="100%"
          height="100%"
          src={embedUrl}
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
          title="YouTube Video"
        />
      </Box>
    </Box>
  );
}