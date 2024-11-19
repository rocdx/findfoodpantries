import {
  Tooltip as TooltipComponent,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { Button } from './ui/button'

export const Tooltip = ({ triggerText, children }) => {
  return (
    <TooltipProvider delayDuration={75}>
      <TooltipComponent>
        <TooltipTrigger asChild>
          <Button className="text-base" variant="link" size="sm">
            {triggerText}
          </Button>
        </TooltipTrigger>
        <TooltipContent className="max-w-xl p-4" side="bottom">
          {children}
        </TooltipContent>
      </TooltipComponent>
    </TooltipProvider>
  )
}
