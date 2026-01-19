import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useAvatarCard } from '@/hooks/useAvatarCard';
import { Sparkles, Share2, Check, Download, BookOpen, Instagram } from 'lucide-react';
import { useState, useRef } from 'react';
import { toast } from '@/hooks/use-toast';
import { toPng } from 'html-to-image';

interface AvatarCardDialogProps {
  userId: string;
  showTrigger?: boolean;
  username?: string;
}

export const AvatarCardDialog = ({ userId, showTrigger = true, username }: AvatarCardDialogProps) => {
  const { character, loading } = useAvatarCard(userId);
  const [copied, setCopied] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const [downloadingStory, setDownloadingStory] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);
  const storyRef = useRef<HTMLDivElement>(null);

  const handleShare = async () => {
    const shareText = `🌟 My BookThreads Avatar: ${character?.name}\n\n"${character?.description}"\n\nTraits: ${character?.traits.join(', ')}\n\nDiscover your reading personality at BookThreads!`;
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: `My BookThreads Avatar: ${character?.name}`,
          text: shareText,
          url: window.location.origin,
        });
      } catch (err) {
        copyToClipboard(shareText);
      }
    } else {
      copyToClipboard(shareText);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    toast({
      title: "Copied to clipboard!",
      description: "Share your avatar card with friends.",
    });
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = async () => {
    if (!cardRef.current || !character) return;
    
    setDownloading(true);
    try {
      const dataUrl = await toPng(cardRef.current, {
        quality: 1,
        pixelRatio: 2,
        backgroundColor: '#1a1a2e',
      });
      
      const link = document.createElement('a');
      link.download = `bookthreads-avatar-${character.name.toLowerCase().replace(/\s+/g, '-')}.png`;
      link.href = dataUrl;
      link.click();
      
      toast({
        title: "Avatar card downloaded!",
        description: "Your avatar card has been saved as an image.",
      });
    } catch (error) {
      console.error('Download failed:', error);
      toast({
        title: "Download failed",
        description: "Unable to download the avatar card. Please try again.",
        variant: "destructive",
      });
    } finally {
      setDownloading(false);
    }
  };

  const handleInstagramStory = async () => {
    if (!storyRef.current || !character) return;
    
    setDownloadingStory(true);
    try {
      const dataUrl = await toPng(storyRef.current, {
        quality: 1,
        pixelRatio: 2,
        backgroundColor: '#1a1a2e',
      });
      
      const link = document.createElement('a');
      link.download = `bookthreads-story-${character.name.toLowerCase().replace(/\s+/g, '-')}.png`;
      link.href = dataUrl;
      link.click();
      
      toast({
        title: "Instagram Story ready!",
        description: "Upload this image to your Instagram Story.",
      });
    } catch (error) {
      console.error('Story download failed:', error);
      toast({
        title: "Download failed",
        description: "Unable to create Instagram Story. Please try again.",
        variant: "destructive",
      });
    } finally {
      setDownloadingStory(false);
    }
  };

  if (loading) {
    return showTrigger ? (
      <Button variant="outline" disabled className="gap-2">
        <Sparkles className="w-4 h-4 animate-pulse" />
        Loading...
      </Button>
    ) : null;
  }

  if (!character) return null;

  const isOwnCard = !username;
  const triggerLabel = isOwnCard ? "My Avatar Card" : "View Avatar Card";
  const displayName = username || "Your";

  return (
    <Dialog>
      {showTrigger && (
        <DialogTrigger asChild>
          <Button variant="outline" className="gap-2 border-primary/30 hover:bg-primary/10">
            <Sparkles className="w-4 h-4 text-primary" />
            {triggerLabel}
          </Button>
        </DialogTrigger>
      )}
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="text-center text-xl font-serif flex items-center justify-center gap-2">
            <Sparkles className="w-5 h-5 text-primary" />
            {username ? `${username}'s Reading Avatar` : 'Your Reading Avatar'}
          </DialogTitle>
        </DialogHeader>
        
        {/* Downloadable Card */}
        <div 
          ref={cardRef}
          className="flex flex-col items-center text-center p-6 rounded-2xl bg-gradient-to-br from-[#1a1a2e] via-[#16213e] to-[#0f3460]"
        >
          {/* BookThreads Logo Header */}
          <div className="flex items-center gap-2 mb-4">
            <div className="flex items-center justify-center w-8 h-8 bg-primary rounded-full">
              <BookOpen className="w-4 h-4 text-primary-foreground" />
            </div>
            <span className="text-white font-serif font-bold text-lg">BookThreads</span>
          </div>

          {/* Character Image */}
          <div className="relative mb-4">
            <div className="w-28 h-28 rounded-full overflow-hidden border-4 border-primary/50 shadow-lg shadow-primary/20">
              <img 
                src={character.image} 
                alt={character.name}
                className="w-full h-full object-cover"
                crossOrigin="anonymous"
              />
            </div>
            <div className="absolute -bottom-2 left-1/2 -translate-x-1/2">
              <Badge className="bg-primary text-primary-foreground shadow-md text-xs">
                Avatar
              </Badge>
            </div>
          </div>

          {/* Username */}
          <p className="text-gray-400 text-sm mb-1">@{displayName}</p>

          {/* Character Name */}
          <h3 className="text-xl font-serif font-bold text-primary mb-1">
            {character.name}
          </h3>

          {/* Book Source */}
          {'book' in character && (
            <p className="text-accent text-xs mb-3 italic">
              from "{(character as any).book}"
            </p>
          )}

          {/* Traits */}
          <div className="flex gap-2 flex-wrap justify-center mb-3">
            {character.traits.map((trait, index) => (
              <Badge key={index} className="text-xs bg-white/10 text-white border-white/20">
                {trait}
              </Badge>
            ))}
          </div>

          {/* Description */}
          <p className="text-gray-300 text-sm leading-relaxed px-2 mb-4">
            {character.description}
          </p>

          {/* Footer */}
          <div className="text-gray-500 text-xs flex items-center gap-1">
            <Sparkles className="w-3 h-3" />
            bookthreads.app
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2 justify-center mt-2 flex-wrap">
          <Button 
            onClick={handleDownload}
            disabled={downloading}
            variant="default"
            className="gap-2"
          >
            <Download className="w-4 h-4" />
            {downloading ? 'Saving...' : 'Download'}
          </Button>
          <Button 
            onClick={handleInstagramStory}
            disabled={downloadingStory}
            variant="outline"
            className="gap-2 border-pink-500/30 hover:bg-pink-500/10 text-pink-400"
          >
            <Instagram className="w-4 h-4" />
            {downloadingStory ? 'Creating...' : 'Insta Story'}
          </Button>
          <Button 
            onClick={handleShare} 
            variant="outline" 
            className="gap-2 border-primary/30 hover:bg-primary/10"
          >
            {copied ? <Check className="w-4 h-4 text-green-500" /> : <Share2 className="w-4 h-4" />}
            {copied ? 'Copied!' : 'Share'}
          </Button>
        </div>

        {/* Hidden Instagram Story Template (9:16 aspect ratio) */}
        <div className="absolute -left-[9999px] top-0">
          <div 
            ref={storyRef}
            className="flex flex-col items-center justify-center text-center p-8 bg-gradient-to-br from-[#1a1a2e] via-[#16213e] to-[#0f3460]"
            style={{ width: '540px', height: '960px' }}
          >
            {/* BookThreads Logo Header */}
            <div className="flex items-center gap-3 mb-8">
              <div className="flex items-center justify-center w-12 h-12 bg-primary rounded-full">
                <BookOpen className="w-6 h-6 text-primary-foreground" />
              </div>
              <span className="text-white font-serif font-bold text-2xl">BookThreads</span>
            </div>

            {/* My Reading Avatar Title */}
            <p className="text-gray-400 text-lg mb-4 uppercase tracking-widest">My Reading Avatar</p>

            {/* Character Image - Larger for story */}
            <div className="relative mb-6">
              <div className="w-44 h-44 rounded-full overflow-hidden border-4 border-primary/50 shadow-lg shadow-primary/20">
                <img 
                  src={character?.image} 
                  alt={character?.name}
                  className="w-full h-full object-cover"
                  crossOrigin="anonymous"
                />
              </div>
              <div className="absolute -bottom-3 left-1/2 -translate-x-1/2">
                <Badge className="bg-primary text-primary-foreground shadow-md text-sm px-4 py-1">
                  Avatar
                </Badge>
              </div>
            </div>

            {/* Username */}
            <p className="text-gray-400 text-lg mb-2">@{displayName}</p>

            {/* Character Name - Larger */}
            <h3 className="text-3xl font-serif font-bold text-primary mb-2">
              {character?.name}
            </h3>

            {/* Book Source */}
            {'book' in (character || {}) && (
              <p className="text-accent text-base mb-6 italic">
                from "{(character as any)?.book}"
              </p>
            )}

            {/* Traits - Larger badges */}
            <div className="flex gap-3 flex-wrap justify-center mb-6 max-w-md">
              {character?.traits.map((trait, index) => (
                <Badge key={index} className="text-sm px-4 py-2 bg-white/10 text-white border-white/20">
                  {trait}
                </Badge>
              ))}
            </div>

            {/* Description - Larger text */}
            <p className="text-gray-300 text-base leading-relaxed px-4 mb-8 max-w-md">
              {character?.description}
            </p>

            {/* Footer */}
            <div className="text-gray-400 text-base flex items-center gap-2 mt-auto">
              <Sparkles className="w-5 h-5" />
              Discover yours at bookthreads.app
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

// Component to just display the character name for profile
export const AvatarCharacterName = ({ userId }: { userId: string }) => {
  const { character, loading } = useAvatarCard(userId);

  if (loading || !character) return null;

  return (
    <Badge variant="outline" className="gap-1 border-primary/30 text-primary">
      <Sparkles className="w-3 h-3" />
      {character.name}
    </Badge>
  );
};