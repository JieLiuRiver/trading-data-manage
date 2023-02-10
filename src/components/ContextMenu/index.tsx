import { Menu } from 'antd';
import { memo, ReactNode, useEffect, useState, useRef } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { createPortal } from 'react-dom';

type ContextMenuItem = {
  id: string;
  name: string | ReactNode;
  onClick: () => void;
  icon?: ReactNode;
};

interface ContextMenuProps {
  parentRef: HTMLElement | null;
  menus: ContextMenuItem[];
}

const menuMap: Record<string, () => void> = {};

const ContextMenu = memo<ContextMenuProps>(({ parentRef, menus }) => {
  const [isVisible, setVisibility] = useState(false);
  const [x, setX] = useState(0);
  const [y, setY] = useState(0);
  const container = useRef<HTMLDivElement | null>(null);
  const containerIdRef = useRef<string>('');
  const forceUpdate = useState(0)[1];

  useEffect(() => {
    const parent = parentRef || null;
    if (!parent) {
      return;
    }

    const showMenu = (event: MouseEvent) => {
      event.preventDefault();
      const yValue = parent.getBoundingClientRect().top + window.scrollY;

      setVisibility(true);
      setX(event.clientX);
      setY(yValue);
    };

    const closeMenu = () => {
      setVisibility(false);
    };

    parent.addEventListener('contextmenu', showMenu);
    window.addEventListener('click', closeMenu);

    return function cleanup() {
      parent.removeEventListener('contextmenu', showMenu);
      window.removeEventListener('click', closeMenu);
    };
  });

  useEffect(() => {
    if (isVisible) {
      container.current = document.createElement('div');
      containerIdRef.current = uuidv4();
      container.current.setAttribute('id', containerIdRef.current);
      container.current.setAttribute('class', 'context-menu-portal');
      document.body.appendChild(container.current);
      forceUpdate((pre) => pre + 1);
      menuMap[containerIdRef.current] = () => setVisibility(false);
    } else {
      try {
        if (container.current) document.body.removeChild(container.current);
      } catch (error) {
        console.log(error);
      }
    }
  }, [isVisible]);

  useEffect(() => {
    if (isVisible && container.current) {
      const list = Array.from(
        document.querySelectorAll('.context-menu-portal'),
      );
      list.forEach((item) => {
        const id = item.getAttribute('id') || '';
        if (
          id !== containerIdRef.current &&
          item.hasChildNodes() &&
          menuMap[id]
        ) {
          if (typeof menuMap[id] === 'function') menuMap[id]();
        }
      });
    }
  }, [isVisible]);

  const style = {
    top: y,
    left: x,
  };

  return isVisible && container.current
    ? createPortal(
        <>
          <div style={{ ...style, position: 'absolute' }}>
            <Menu
              style={{ boxShadow: '1px 1px 3px 0px rgba(0,0,0,0.44)' }}
              items={menus.map((menu) => ({
                danger: false,
                icon: menu.icon,
                label: menu.name,
                key: menu.id,
                onClick: menu.onClick,
              }))}
            />
          </div>
        </>,
        container.current,
      )
    : null;
});

export default ContextMenu;
