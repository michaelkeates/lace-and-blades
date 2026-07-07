import { Box } from '@chakra-ui/react';

export function LBPoster({ children }) {
  return (
    <Box 
      className="lb-poster-wrap"
      maxW="980px" mx="auto" mb="50px" borderRadius="18px" overflow="hidden"
      boxShadow="0 12px 35px rgba(80, 40, 45, 0.16)"
      color="#251f1f"
      fontFamily="var(--font-cormorant)"
      bg="#fffaf9"
      // Use sx to ensure children inherit the specific styles
      sx={{
        ".lb-poster-content": { p: ["30px 24px", "42px 54px 32px 54px"], bg: "linear-gradient(180deg, #fffaf9 0%, #fff4f3 100%)" },
        ".lb-intro-piece": { textAlign: "center", fontStyle: "italic", fontSize: "24px" },
        "em": { fontFamily: "var(--font-dancing)", color: "#c86470", fontStyle: "normal", fontSize: "1.35em" },
        "strong": { color: "#c86470", fontWeight: 700 },
        ".lb-title": { fontFamily: "var(--font-playfair)", color: "#c86470", textTransform: "uppercase", fontSize: ["38px", "72px"] },
        ".lb-heading": { fontFamily: "var(--font-cormorant)", fontWeight: 700, color: "#201a1a" }
      }}
    >
      <div className="lb-poster-content">
        {children}
      </div>
    </Box>
  );
}