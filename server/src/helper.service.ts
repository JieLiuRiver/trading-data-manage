
import { Injectable } from '@nestjs/common';

@Injectable()
export class HelperService {
    throttle(fn: (...args: any[]) => void, interval: number) {
        let timeout;
        return function() {
            if (!timeout) {
                timeout = setTimeout(() => {
                    timeout = null;
                    fn.apply(this, arguments);
                }, interval);
            }
        };
    };
}
